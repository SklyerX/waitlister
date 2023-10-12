"use client";

import CreateWebhook from "@/components/dialogs/create-webhook";
import { Skeleton } from "@/components/ui/skeleton";
import getWebhooks from "@/hooks/react-query/get-webhooks";
import { Webhook } from "@prisma/client";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { isLoading, isSuccess, isRefetching, data, refetch } = getWebhooks();
  const [webhooks, setWebhooks] = useState<Array<Webhook> | []>([]);
  const params = useParams();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setWebhooks(Array.isArray(data) ? data : [data]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (data) {
      setWebhooks(data);
    }
  }, [data]);

  return (
    <div className="container mt-10 w-full">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg font-semibold">Webhooks</h1>
        <CreateWebhook
          onSuccess={() => {
            refetch().then((res) => {
              setWebhooks(res.data);
            });
          }}
        />
      </div>
      <p className="text-muted-foreground/80 text-sm w-8/12">
        Create webhooks to notify your application when an event happens in your
        waitlist, such as a new subscriber.
      </p>
      <div className="mt-5">
        {isLoading || isRefetching ? (
          <>
            <Skeleton className="w-full h-10 mb-1" />
            <Skeleton className="w-full h-10 mb-1" />
            <Skeleton className="w-full h-10 mb-1" />
            <Skeleton className="w-full h-10 mb-1" />
            <Skeleton className="w-full h-10 mb-1" />
          </>
        ) : null}
        {!isLoading && !isRefetching && webhooks.length === 0 ? (
          <div className="items-center justify-center flex flex-col mt-5 border-2 p-10 rounded-md border-dotted">
            <Ghost className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Pretty empty here</h2>
            <p className="text-foreground/60">
              Let's create your first webhook
            </p>
          </div>
        ) : null}
        <div className="mt-10 w-full flex flex-wrap gap-2">
          {!isLoading &&
            webhooks &&
            webhooks.length !== 0 &&
            Array.isArray(webhooks) &&
            webhooks.map((webhook, index) => (
              <Link
                className="border mb-2 rounded-md p-4 w-full"
                href={`/dashboard/${params.id}/webhooks/${webhook.id}`}
                key={index}
              >
                {webhook.endpoint}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
