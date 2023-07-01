import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";

const UserLinks = () => {
  const router = useRouter();

  const username = useMemo(() => router.query.username, [router]);

  const { data: user } = api.users.getUserByUsername.useQuery(
    {
      username: username as string,
    },
    {
      enabled: !!username,
    }
  );

  const { data: links } = api.links.getLinks.useQuery(
    { userId: user && user[0]?.id },
    { enabled: !!user }
  );

  return (
    <main className="container mx-auto flex h-screen flex-col items-center">
      <h2>{username}</h2>
      <div>
        <div>27</div>
        <div>they/them</div>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        {links?.map((link) => {
          return (
            <div
              className="flex items-center justify-between gap-4 rounded-lg bg-gray-800 px-4 py-2"
              key={link.id}
            >
              <Link
                className="grow hover:underline"
                href={link.href}
                target="_blank"
              >
                {link.name}
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default UserLinks;
