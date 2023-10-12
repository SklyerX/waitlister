import { EmailCredentials } from "@/lib/validators/email";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function addEmal() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ email }: EmailCredentials) => {
      const { data } = await axios.post(
        `/api/projects/subscribers`,
        {
          email,
        },
        {
          headers: { "x-project-id": params.id },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Email added.");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
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
