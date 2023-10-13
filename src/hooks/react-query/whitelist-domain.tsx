import { DomainCredentials } from "@/lib/validators/domain";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function whitelistDomain() {
  const params = useParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ url }: DomainCredentials) => {
      const { data } = await axios.post(`/api/projects/${params.id}/domains`, {
        url,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Whitelisted domain");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return router.replace("/dashboard");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while whitelisting domain!");
      }

      toast.error(
        "Something went wrong while whitelisting domain! Please try again later."
      );
    },
  });
}
