"use client";

import getProjects from "@/hooks/react-query/get-projects";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data, isSuccess } = getProjects();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      if (data.length === 0) {
        redirect(`/dashboard/create`);
      } else {
        redirect(`/dashboard/${data[0].projectId}`);
      }
    }
  }, [isSuccess]);

  return <></>;
}
