import { ProjectCredentials } from "@/lib/validators/project";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function createProject() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ ...props }: ProjectCredentials) => {
      const { data } = await axios.post(`/api/projects/`, {
        ...props,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Created project");
      router.push(`/dashboard/${data.id}/code`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while creating project!");
      }

      toast.error(
        "Something went wrong while creating project! Please try again later."
      );
    },
  });
}
