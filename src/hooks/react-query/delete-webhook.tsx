import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function deleteWebhook() {
  const params = useParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/projects/${params.id}/`);
      return data;
    },
    onSuccess: async () => {
      toast.success("Project deleted.");
      router.replace(`/dashboard/${params.id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while deleting project!");
      }

      toast.error(
        "Something went wrong while deleting project! Please try again later."
      );
    },
  });
}
