import { getAuthSession } from "@/lib/auth";
import { User } from "@prisma/client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserDropdown from "../dropdowns/UserDropdown";
import { buttonVariants } from "../ui/button";
import GroupDropdown from "../dropdowns/GroupDropdown";

export default async function DashboardNavbar() {
  const session = await getAuthSession();

  if (!session) redirect("/");

  return (
    <div className="container z-40 bg-background flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2">
          <Mail className="w-5 h-5" />
          WaitList
        </span>
        <span>/</span>
        <GroupDropdown />
      </div>
      {session?.user ? (
        <UserDropdown user={session.user as User} />
      ) : (
        <Link href="/login" className={buttonVariants()}>
          Log In
        </Link>
      )}
    </div>
  );
}
