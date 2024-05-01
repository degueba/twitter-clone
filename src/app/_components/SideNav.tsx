import Link from "next/link";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import SignOut from "./SignOut";
async function SideNav() {
  const session = await getServerAuthSession();
  const user = session?.user;

  console.log(user);
  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">Home</Link>
        </li>
        {user != null ? (
          <>
            <li>
              <Link href={`/profiles/${user.id}`}>My Profile</Link>
            </li>
            <li>
              <SignOut />
            </li>
          </>
        ) : (
          <a href="/api/auth/signin">Sign in</a>
        )}
      </ul>
    </nav>
  );
}

export default SideNav;
