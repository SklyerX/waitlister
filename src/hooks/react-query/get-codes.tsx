import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getCodes() {
  const params = useParams();
  const router = useRouter();

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["codesRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${params.id}/code`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return router.replace("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching data!");
      }

      toast.error(
        "Something went wrong while fetching data! Please try again later."
      );
    },
  });
}
