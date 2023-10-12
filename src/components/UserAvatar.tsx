import { User } from "@prisma/client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export default function UserAvatar({ user, ...props }: Props) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="Profile Picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <UserIcon className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
