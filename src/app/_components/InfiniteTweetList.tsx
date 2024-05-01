import type { User } from "next-auth";
import InfiniteScroll from "react-infinite-scroll-component";
import TweetCard from "./TweetCard";

export type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: User;
};

interface InfiniteTweetListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
}

function InfiniteTweetList({
  isLoading,
  isError,
  hasMore,
  fetchNewTweets,
  tweets,
}: InfiniteTweetListProps) {
  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  if (tweets == null) return null;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No tweets</h2>
    );
  }

  return (
    <ul className="p-5">
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={"Loading..."}
      >
        {tweets.map((tweet) => {
          return <TweetCard key={tweet.id} {...tweet} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

export default InfiniteTweetList;
