import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getDomains() {
  const params = useParams();

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["domainsRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${params.id}/domains`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

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
