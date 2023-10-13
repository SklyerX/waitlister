import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";

export default function getProjects() {
  return useQuery({
    queryKey: ["projectsDataRepo"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return redirect("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching projects!");
      }

      toast.error(
        "Something went wrong while fetching projects! Please try again later."
      );
    },
  });
}
