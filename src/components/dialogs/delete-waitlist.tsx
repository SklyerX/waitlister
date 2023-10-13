import deleteWebhook from "@/hooks/react-query/delete-webhook";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function DeleteWaitlist() {
  const { mutate, isLoading, isSuccess } = deleteWebhook();
  const router = useRouter();

  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      router.replace("/dashboard");
    }
  }, [isSuccess]);

  return (
    <AlertDialog
      open={opened}
      onOpenChange={(e) => {
        if (isLoading) return;
        setOpened(e);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Waitlist
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            asChild
          >
            <Button isLoading={isLoading}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
