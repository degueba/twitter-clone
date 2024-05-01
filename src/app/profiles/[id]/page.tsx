"use client";
import Head from "next/head";
import Image from "next/image";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { api } from "~/trpc/react";

function ProfileId({ params }: { params: { id: string } }) {
  const profileId = params?.id;
  const profile = api.profile.getById.useQuery({
    id: profileId,
  });

  if (profile.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Head>
        <title>{`Twitter Clone`}</title>
      </Head>
      <aside>
        <div className="flex items-center gap-2 px-6 pb-4 pt-6">
          <Image
            src={profile?.data?.image ?? ""}
            alt="Profile Image"
            width="40"
            height="40"
            className="rounded-full"
          />
          <span>@{profile?.data?.name}</span>
        </div>
      </aside>
      <aside className="flex gap-3 px-6">
        <span>
          <b className="pr-2">Followers:</b>
          {profile?.data?._count?.followers}
        </span>
        <span className="text-gray-300">|</span>
        <span>
          <b className="pr-2">Friends:</b> {profile?.data?._count?.follows}
        </span>
        <span className="text-gray-300">|</span>
        <span>
          <b className="pr-2">Tweets:</b>
          {profile?.data?._count?.tweets}
        </span>
      </aside>
    </div>
  );
}

export default ProfileId;
