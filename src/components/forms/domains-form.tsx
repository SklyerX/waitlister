import whitelistDomain from "@/hooks/react-query/whitelist-domain";
import { DomainCredentials, DomainValidator } from "@/lib/validators/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import clsx from "clsx";
import { Button } from "../ui/button";
import { useEffect } from "react";

interface Props {
  onSuccess: () => void;
}

export default function DomainsForm({ onSuccess }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<DomainCredentials>({
    resolver: zodResolver(DomainValidator),
  });

  const { mutate, isLoading, isSuccess } = whitelistDomain();

  const onSubmit = (data: DomainCredentials) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
      <Input
        placeholder="https://skylerx.ir"
        {...register("url")}
        className={clsx("w-[220px]", errors.url ? "!outline-red-500" : null)}
      />
      <Button isLoading={isLoading} size="sm">
        add
      </Button>
    </form>
  );
}
