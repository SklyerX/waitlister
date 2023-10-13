import { WebhookCredentials } from "@/lib/validators/webhook";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function createWebhook() {
  const params = useParams();
  const router = useRouter();

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
        if (err.response?.status === 404) return router.replace("/dashboard");

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
