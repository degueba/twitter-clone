import NewTweetForm from "./_components/NewTweetForm";
import Tweets from "./_components/Tweets";

export default async function Home() {
  return (
    <main>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
      <Tweets />
    </main>
  );
}
