"use client";

import createProject from "@/hooks/react-query/create-project";
import { ProjectCredentials, ProjectValidator } from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function CreateProject() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectCredentials>({
    resolver: zodResolver(ProjectValidator),
  });

  const { mutate, isLoading } = createProject();

  const onSubmit = (data: ProjectCredentials) => mutate(data);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            By creating a new project you will be able to setup waitlists.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5 mt-0">
          <div>
            <span className="text-xs">Name</span>
            <Input
              className="mt-1"
              {...register("name")}
              placeholder="Cool App"
            />
            {errors.name ? (
              <span className="my-2 text-red-500 text-xs">
                {errors.name.message}
              </span>
            ) : null}
          </div>
          <DialogFooter className="mt-5">
            <Button isLoading={isLoading} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
