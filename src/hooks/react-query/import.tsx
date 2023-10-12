import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function importSubscribers() {
  const params = useParams();

  return useMutation({
    mutationFn: async (emails: string[]) => {
      const { data } = await axios.post(`/api/projects/${params.id}/import`, {
        emails,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully imported subscribers");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while importing subscribers!");
      }

      toast.error(
        "Something went wrong while importing subscribers! Please try again later."
      );
    },
  });
}
