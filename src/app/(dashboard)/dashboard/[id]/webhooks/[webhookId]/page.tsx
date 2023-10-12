"use client";

import Analytics from "@/components/Analytics";
import CopyButton from "@/components/CopyButton";
import DeleteWebhook from "@/components/dialogs/delete-webhook";
import { Skeleton } from "@/components/ui/skeleton";
import getWebhook from "@/hooks/react-query/get-webhook";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function WebhookPage() {
  const { data, isLoading } = getWebhook();
  const [show, setShow] = useState<boolean>(false);

  const showSecret = () => setShow(true);
  const hideSecret = () => setShow(false);

  return (
    <div className="container mt-10">
      {isLoading ? (
        <Skeleton className="w-[600px] h-7" />
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{data?.endpoint}</h2>
          <DeleteWebhook />
        </div>
      )}
      {isLoading ? (
        <Skeleton className="w-[300px] mt-1 h-6" />
      ) : (
        <p className="text-muted-foreground/60 mt-0.5">
          {data?.description || "Unknown"}
        </p>
      )}

      <div className="mt-8">
        <h3 className="font-medium text-xl">Quick Copy</h3>
        <p className="text-muted-foreground text-sm">
          Copy your API key to your clipboard.
        </p>
      </div>

      <div className="w-full border bg-background/40 relative mt-3 rounded-md">
        <div className="p-2 border-b flex items-center justify-between">
          <span>.env</span>
          <div className="flex items-center gap-1">
            {show ? (
              <EyeOff className="w-5 h-5 cursor-pointer" onClick={hideSecret} />
            ) : (
              <Eye className="w-5 h-5 cursor-pointer" onClick={showSecret} />
            )}
            <CopyButton
              text={`WAITLIST_WEBHOOK_SECRET=${data?.signingSecret}`}
            />
          </div>
        </div>
        <div className="p-4 overflow-x-scroll pr-3">
          {isLoading ? (
            <Skeleton className="w-11/12 h-[20px]" />
          ) : (
            <>
              <span className="text-blue-400">WAITLIST_WEBHOOK_SECRET</span>=
              <span>
                {show ? data?.signingSecret : "whsec_" + "*".repeat(32)}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="mt-8">
        <div className="border-b pb-4">
          <h3 className="font-medium text-xl">Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Here is the past webhook events that have been triggered and
            captured by this webhook.
          </p>
        </div>
        <div className="mt-4">
          <Analytics />
        </div>
      </div>
    </div>
  );
}
