"use client";

import { WebhookCredentials, WebhookValidator } from "@/lib/validators/webhook";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "../ui/textarea";
import createWebhook from "@/hooks/react-query/create-webhook";
import { useEffect } from "react";

interface Props {
  onSuccess: () => void;
}

export default function CreateWebhook({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebhookCredentials>({
    resolver: zodResolver(WebhookValidator),
    defaultValues: {
      endpoint: "https://",
    },
  });

  const { mutate, isLoading, isSuccess } = createWebhook();

  const onSubmit = (data: WebhookCredentials) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Webhook</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new webhook</DialogTitle>
          <DialogDescription>
            By creating a webhook you will be able to notify other services
            (your apps) of a new waitlist
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5 mt-0">
          <div>
            <span className="text-xs">Endpoint URL</span>
            <Input
              className="mt-1"
              {...register("endpoint")}
              placeholder="e.g. https://example.com/webhook"
            />
            {errors.endpoint ? (
              <span className="my-2 text-red-500 text-xs">
                {errors.endpoint.message}
              </span>
            ) : null}
          </div>
          <div className="mt-3">
            <span className="text-xs">Description</span>
            <Textarea
              className="mt-1"
              {...register("description")}
              placeholder="An optional description of what this endpoint is used for."
              rows={5}
            />
            {errors.endpoint ? (
              <span className="my-2 text-red-500 text-xs">
                {errors.endpoint.message}
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
