"use client";

import { Skeleton } from "@/components/ui/skeleton";
import getOverview from "@/hooks/react-query/get-overview";
import { getDateInReadableFormat } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tooltip } from "recharts";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function Page() {
  const { data, isLoading, isSuccess } = getOverview();
  const [events, setEvents] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (isSuccess) {
      const array =
        Object.keys(data.activity).map((month) => ({
          name: month.substring(0, 3),
          value: data.activity[month],
        })) || [];

      setEvents(array);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (events) {
      console.log(events);
    }
  }, [events]);

  return (
    <div className="container mt-10">
      <h3 className="text-lg font-medium">Overview</h3>
      <p className="text-muted-foreground text-sm mb-5">
        Analytics and insights about your waitlist.
      </p>
      {isLoading ? (
        <>
          <div className="mt-10 grid md:grid-cols-3 gap-2">
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Subscribers</p>
              <Skeleton className="w-full h-7" />
            </div>
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Last Subscribe</p>
              <Skeleton className="w-full h-7" />
            </div>
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Referals</p>
              <Skeleton className="w-full h-7" />
            </div>
          </div>
          <Skeleton className="w-full h-96 mt-5" />
        </>
      ) : (
        <>
          <div className="mt-10 grid md:grid-cols-3 gap-2">
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Subscribers</p>
              <h3 className="text-lg font-medium">{data?.totalSubs || "0"}</h3>
            </div>
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Last Subscribe</p>
              <h3 className="text-lg font-medium">
                {data?.lastSubDate
                  ? getDateInReadableFormat(data?.lastSubDate)
                  : "Never"}
              </h3>
            </div>
            <div className="flex-1 h-[150px] p-4 border rounded-md flex flex-col justify-between">
              <p className="text-muted-foreground text-sm">Referals</p>
              <h3 className="text-lg font-medium">
                {data?.totalReferals || "0"}
              </h3>
            </div>
          </div>
          <div className="w-full h-[250px] bg-background border rounded-md mt-5 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={500} height={300} data={events}>
                <XAxis dataKey="name" />
                <Tooltip
                  contentStyle={{
                    background: "#212121",
                    borderColor: "hsl(var(--input))",
                    borderRadius: 5,
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
