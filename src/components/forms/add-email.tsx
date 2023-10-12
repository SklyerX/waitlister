import whitelistDomain from "@/hooks/react-query/whitelist-domain";
import { DomainCredentials } from "@/lib/validators/domain";
import { EmailCredentials, EmailValidator } from "@/lib/validators/email";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import addEmail from "@/hooks/react-query/add-email";

interface Props {
  onSuccess: () => void;
}

export default function EmailForm({ onSuccess }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailCredentials>({
    resolver: zodResolver(EmailValidator),
  });

  const { mutate, isLoading, isSuccess } = addEmail();

  const onSubmit = (data: EmailCredentials) => {
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
        placeholder="hello@skylerx.ir"
        {...register("email")}
        className={clsx("w-[220px]", errors.email ? "!outline-red-500" : null)}
      />
      <Button isLoading={isLoading} size="sm">
        add
      </Button>
    </form>
  );
}
