import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Mail } from "lucide-react";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className="container border-b md:border-none mb-5 md:mb-0 z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-6">
        <div className="flex gap-6 items-center md:gap-10">
          <Link href="/" className="items-center md:flex hidden space-x-2">
            <Mail className="w-6 h-6" />
            <span className="text-2xl font-semibold">Waitlister</span>
          </Link>
        </div>
        {session ? (
          <Link href="/dashboard">
            <img
              src={session.user?.image!}
              className="w-10 h-10 rounded-full"
            />
          </Link>
        ) : (
          <Link
            href="/api/auth/signin"
            className={buttonVariants({ variant: "default" })}
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}
