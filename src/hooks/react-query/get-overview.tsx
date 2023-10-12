import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getOverview() {
  const params = useParams();

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["overviewRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${params.id}/overview`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error(
          "Something went wrong while fetching overview data!"
        );
      }

      toast.error(
        "Something went wrong while fetching overview data! Please try again later."
      );
    },
  });
}
