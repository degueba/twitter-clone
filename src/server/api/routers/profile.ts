import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
import { publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const profile = await ctx.db.user.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          image: true,
          _count: { select: { followers: true, follows: true, tweets: true } },
          followers:
            currentUserId === null
              ? undefined
              : {
                  where: {
                    id: currentUserId,
                  },
                },
        },
      });

      return profile;
    }),
});
