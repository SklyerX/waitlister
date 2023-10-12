"use client";

import getProjects from "@/hooks/react-query/get-projects";
import { Project } from "@prisma/client";
import CreateProject from "../dialogs/create-project";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { redirect, useParams, usePathname } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

export default function GroupDropdown() {
  const { data, isSuccess, isLoading } = getProjects();
  const [name, setName] = useState<string>("");

  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    if (isSuccess) {
      const index = data.findIndex((x: Project) => x.projectId === params.id);

      if (!isLoading && data.length === 0 && pathname !== "/dashboard/create") {
        setName("Loading");
        redirect("/dashboard/create");
      } else if (data.length !== 0) {
        setName(data[index].name);
      }
    }
  }, [isSuccess]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border p-2 rounded-md px-4 text-sm">
        {isLoading && !data ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center">
            <span>{name}</span>
            <ChevronDown className="w-4 h-4 ml-3" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <>
            <p>fetching...</p>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            {data?.map((project: Project, index: number) => (
              <DropdownMenuCheckboxItem
                checked={project.projectId === params.id}
                key={index}
              >
                <Link href={`/dashboard/${project.projectId}`}>
                  {project.name}
                </Link>
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuLabel>Other</DropdownMenuLabel>
            <CreateProject />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
