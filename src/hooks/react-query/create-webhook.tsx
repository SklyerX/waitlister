import { DomainCredentials } from "@/lib/validators/domain";
import { WebhookCredentials } from "@/lib/validators/webhook";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function createWebhook() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ ...props }: WebhookCredentials) => {
      const { data } = await axios.post(`/api/projects/webhooks/${params.id}`, {
        ...props,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Created webhook");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while creating webhook!");
      }

      toast.error(
        "Something went wrong while creating webhook! Please try again later."
      );
    },
  });
}
