import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { api } from "~/trpc/react";

type HeartButtonProps = {
  tweetId: string;
  likedByMe: boolean;
  likeCount: number;
};

export default function HeartButton({
  tweetId,
  likedByMe,
  likeCount,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  const trpcUtils = api.useUtils();
  const like = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
    },
  });

  const toggleTweet = () => {
    like.mutate({
      tweetId,
    });
  };

  if (session.status === "authenticated") {
    return (
      <div className="mb-1 mt-1 flex cursor-pointer items-center gap-3 self-start text-gray-500">
        <div className="group flex h-8 w-8 rounded-full p-2 align-middle transition-colors ease-linear hover:bg-red-200">
          <button onClick={toggleTweet}>
            <HeartIcon className="text-red-400 group-hover:text-red-400" />
          </button>
        </div>
        <span>{likeCount}</span>
      </div>
    );
  } else {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start ">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
}
