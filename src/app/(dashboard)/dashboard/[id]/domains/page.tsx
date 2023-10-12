"use client";

import DomainsForm from "@/components/forms/domains-form";
import DeleteDomain from "@/components/handlers/delete-domain";
import { Skeleton } from "@/components/ui/skeleton";
import getDomains from "@/hooks/react-query/get-domains";
import { useEffect, useState } from "react";

export default function Domains() {
  const { data, isLoading, isSuccess, isRefetching, refetch } = getDomains();
  const [domains, setDomains] = useState<Array<string> | []>([]);

  useEffect(() => {
    if (isSuccess) {
      setDomains(Array.isArray(data) ? data : [data]);
    }
  }, [isSuccess]);

  return (
    <div className="container mt-10">
      <h1 className="text-lg font-semibold">Domains</h1>
      <p className="text-muted-foreground">
        Whitelist domains that can subscribe to your waitlist.
      </p>
      <div className="w-full rounded-md border bg-background/40 p-5 mt-3 flex items-center justify-between">
        <p className="text-sm">
          Add a domain to whitelist it. You can add multiple domains.
        </p>
        <DomainsForm
          onSuccess={() =>
            refetch().then((res) => {
              setDomains(res.data);
            })
          }
        />
      </div>
      <div className="mt-10 font-semibold">Domain</div>
      <div className="mt-2 border-t pt-2">
        {!isLoading &&
          !isRefetching &&
          domains &&
          domains.length !== 0 &&
          Array.isArray(domains) &&
          domains.map((domain, index) => (
            <div className="flex items-center mb-2 justify-between" key={index}>
              <p className="text-muted-foreground">{domain}</p>
              <DeleteDomain url={domain} onDelete={refetch} />
            </div>
          ))}
        {isLoading || isRefetching ? (
          <>
            <Skeleton className="w-full h-10 mb-2" />
            <Skeleton className="w-full h-10 mb-2" />
            <Skeleton className="w-full h-10 mb-2" />
            <Skeleton className="w-full h-10 mb-2" />
            <Skeleton className="w-full h-10 mb-2" />
          </>
        ) : null}
      </div>
    </div>
  );
}
