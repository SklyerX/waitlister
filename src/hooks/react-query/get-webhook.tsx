import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getWebhook() {
  const params = useParams();

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["webhookRepo"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/projects/webhooks/${params.id}/${params.webhookId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching domain!");
      }

      toast.error(
        "Something went wrong while fetching domain! Please try again later."
      );
    },
  });
}
