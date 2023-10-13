import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function deleteDomain() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ url }: { url: string }) => {
      const { data } = await axios.delete(
        `/api/projects/${params.id}/domains?url=${url}`
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Blacklisted domain");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while deleting domain!");
      }

      toast.error(
        "Something went wrong while deleting domain! Please try again later."
      );
    },
  });
}
