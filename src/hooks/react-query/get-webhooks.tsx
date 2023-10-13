import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getWebhooks() {
  const params = useParams();
  const router = useRouter();

  return useQuery({
    refetchOnWindowFocus: true,
    enabled: false,
    queryKey: ["webhooksRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/webhooks`, {
        headers: { cache: "no-store", "x-project-id": params.id },
      });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return router.replace("/dashboard");

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
