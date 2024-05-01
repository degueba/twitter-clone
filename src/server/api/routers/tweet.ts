import { z } from "zod";

import { type Prisma } from "@prisma/client";
import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { onlyFollowing, limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      return await getInfiniteTweets({
        whereClause:
          currentUserId == null || !onlyFollowing
            ? undefined
            : {
                user: {
                  followers: {
                    some: {
                      id: currentUserId,
                    },
                  },
                },
              },
        ctx,
        limit,
        cursor,
        onlyFollowing,
      });
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const tweet = await ctx.db.tweet.create({
        data: {
          content,
          userId: ctx.session.user.id,
        },
      });

      return tweet;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ input: { tweetId }, ctx }) => {
      const data = {
        tweetId,
        userId: ctx.session.user.id,
      };

      const hasUserLike = await ctx.db.like.findUnique({
        where: {
          userId_tweetId: data,
        },
      });

      if (hasUserLike == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({
          where: {
            userId_tweetId: data,
          },
        });
        return { addedLike: false };
      }
    }),
});

async function getInfiniteTweets({
  whereClause,
  ctx,
  limit,
  cursor,
  onlyFollowing,
}: {
  whereClause?: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: Awaited<ReturnType<typeof createTRPCContext>>;
  onlyFollowing?: boolean;
}) {
  const currentUserId = ctx.session?.user.id;

  const tweets = await ctx.db.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId === null ? false : { where: { userId: currentUserId } },
      user: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
    where: whereClause,
  });

  let nextCursor: typeof cursor | undefined;
  if (tweets.length > limit) {
    const nextItem = tweets.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    tweets: tweets.map((tweet) => {
      return {
        id: tweet.id,
        content: tweet.content,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        user: tweet.user,
        likedByMe: tweet.likes?.length > 0,
      };
    }),
    nextCursor,
  };
}
