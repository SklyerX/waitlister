import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
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
      router.replace(`/dashboard`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return router.replace("/dashboard");

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
