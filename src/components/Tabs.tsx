"use client";

import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const navigation_options = (id: string) => [
  {
    name: "Overview",
    href: `/dashboard/${id}`,
  },
  {
    name: "Subscribers",
    href: `/dashboard/${id}/subscribers`,
  },
  {
    name: "Domains",
    href: `/dashboard/${id}/domains`,
  },
  {
    name: "Code",
    href: `/dashboard/${id}/code`,
  },
  {
    name: "Webhooks",
    href: `/dashboard/${id}/webhooks`,
  },
  {
    name: "Settings",
    href: `/dashboard/${id}/settings`,
  },
];

export default function Tabs() {
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="container">
      <div className="border-b mt-5 mr-3 mb-0">
        <div className="items-stretch flex gap-10 overflow-x-scroll mt-4 md:mt-0">
          {navigation_options(params.id as string).map((option, index) => (
            <Link
              href={option.href}
              className={clsx(
                "h-8 hover:text-foreground/80 transition-colors text-sm",
                option.href === `${pathname}`
                  ? "border-b-2 border-foreground text-foreground hover:text-foreground"
                  : "text-foreground/50"
              )}
              key={index}
            >
              {option.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
