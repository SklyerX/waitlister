import { ProjectCredentials } from "@/lib/validators/project";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function changeName() {
  const params = useParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ name }: ProjectCredentials) => {
      const { data } = await axios.patch(`/api/projects/${params.id}/`, {
        name,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully changed project name.");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return router.replace("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while changing name!");
      }

      toast.error(
        "Something went wrong while changing name! Please try again later."
      );
    },
  });
}
