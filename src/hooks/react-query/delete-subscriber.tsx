import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function deleteSubscriber() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await axios.delete(`/api/projects/subscribers/${id}`, {
        headers: {
          "x-project-id": params.id,
        },
      });
      return data;
    },
    onSuccess: async () => {
      toast.success("User removed.");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while deleting email!");
      }

      toast.error(
        "Something went wrong while deleting email! Please try again later."
      );
    },
  });
}
