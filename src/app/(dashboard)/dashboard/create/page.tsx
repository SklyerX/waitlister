"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import createProject from "@/hooks/react-query/create-project";
import { ProjectCredentials, ProjectValidator } from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectCredentials>({
    resolver: zodResolver(ProjectValidator),
  });

  const { mutate, isLoading } = createProject();

  return (
    <div className="flex justify-center mt-10 p-4">
      <form
        onSubmit={handleSubmit((data) => mutate({ name: data.name }))}
        className="w-[450px] border rounded-md p-7"
      >
        <h3 className="text-lg font-medium">Create a new playlist</h3>
        <p className="text-muted-foreground text-sm">
          Enter a name for your waitlist. You can change this later. Waitlists
          are private by default.
        </p>
        <div className="mt-4">
          <span className="text-xs">Name</span>
          <Input {...register("name")} />
          {errors.name ? (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          ) : null}
        </div>
        <Button isLoading={isLoading} className="mt-5">
          Create
        </Button>
      </form>
    </div>
  );
}
