import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function deleteWaitlist() {
  const params = useParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/projects/${params.id}`);
      return data;
    },
    onSuccess: async () => {
      toast.success("Webhook deleted.");
      router.replace(`/dashboard/${params.id}/webhooks`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while deleting webhook!");
      }

      toast.error(
        "Something went wrong while deleting webhook! Please try again later."
      );
    },
  });
}
