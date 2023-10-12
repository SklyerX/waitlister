"use client";

import CopyButton from "@/components/CopyButton";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import getCodes from "@/hooks/react-query/get-codes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const code = `const waitlist = 'WAITLIST ID';
const email = 'janesmith@example.com';
const name = 'Jane Smith'; // Optional
const phone = '555-555-5555'; // Optional
const referredBy = 'abc123'; // Optional
const metadata = { userId: 'abcd' }; // Optional

/* With client-side JavaScript, you don't need the API Key
 * if you call the endpoint from a whitelisted domain. This
 * way, you don't need to expose your API Key to the public.
 */
try {
  const response = await fetch('/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': waitlist
    },
    body: JSON.stringify({
      email,
      name,
      phone,
      referredBy,
      metadata,
    }),
  });

  const body = (await response.json()) as { message: string };

  if (!response.ok) {
    throw new Error(body.message);
  }

  window.alert('You have been subscribed!');
} catch (error) {
  window.alert(error.message);
}`;

export default function Page() {
  const { isLoading, data } = getCodes();

  return (
    <div className="container mt-10">
      <div className="border-b flex flex-col items-start pb-4 lg:flex-row lg:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Create subscriber code</h3>
          <p className="text-muted-foreground/60 text-sm">
            Use the code below to subscribe users to your waitlist.
          </p>
        </div>
        <div className="flex items-center mt-5 lg:mt-0 gap-5">
          <div>
            <span className="text-xs mb-1">Project ID</span>
            {!isLoading ? (
              <Input value={data?.projectId} className="w-[250px]" />
            ) : (
              <Skeleton className="w-[250px] h-9" />
            )}
          </div>
          <div>
            <span className="text-xs mb-1">Project Secret</span>
            {!isLoading ? (
              <Input value={data?.projectSecret} className="w-[250px]" />
            ) : (
              <Skeleton className="w-[250px] h-9" />
            )}
          </div>
        </div>
      </div>
      <h3 className="text-xl mt-10 font-semibold">Create subscriber code</h3>
      <p className="text-muted-foreground/60 text-sm">
        Use the code below to subscribe users to your waitlist.
      </p>
      <div className="relative mt-2">
        <SyntaxHighlighter
          customStyle={{
            borderRadius: 5,
          }}
          language="typescript"
          style={vscDarkPlus}
        >
          {code}
        </SyntaxHighlighter>
        <div className="absolute right-2 top-2">
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
}
