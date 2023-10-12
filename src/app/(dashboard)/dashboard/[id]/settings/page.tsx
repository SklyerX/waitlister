"use client";

import FileManager from "@/components/FileManager";
import DeleteWaitlist from "@/components/dialogs/delete-waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import changeName from "@/hooks/react-query/change-name";
import getInformation from "@/hooks/react-query/get-info";
import { ProjectCredentials, ProjectValidator } from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Settings() {
  const { data, isSuccess } = getInformation();
  const { mutate, isLoading } = changeName();

  useEffect(() => {
    if (isSuccess) {
      setValue("name", data.name);
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectCredentials>({
    resolver: zodResolver(ProjectValidator),
  });

  return (
    <div className="container mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Settings</h3>
        <DeleteWaitlist />
      </div>
      <p className="text-muted-foreground/70 text-sm mb-5">
        Update your project settings.
      </p>

      <span className="text-sm mb-1">Name</span>
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-1"
      >
        <Input placeholder="project name" {...register("name")} />
        {errors.name ? (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        ) : null}
        <Button
          isLoading={isLoading}
          type="submit"
          size="sm"
          className="mt-2 w-fit"
        >
          Save
        </Button>
      </form>
      <div className="w-full h-[1px] border mt-10 mb-5"></div>
      <h3 className="text-lg font-medium">Import subscribers</h3>
      <p className="text-muted-foreground/70 text-sm mb-5">
        Import subscribers from a CSV file. Duplicate emails will be skipped
      </p>
      <div className="mt-5">
        <FileManager />
      </div>
    </div>
  );
}
