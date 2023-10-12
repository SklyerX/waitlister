import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { WebhookAnalytic } from "@prisma/client";
import { sleep } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import ReactJson from "react-json-view";

interface IGetData {
  currentPage: number;
  perPage: number;
  increment: boolean;
  ids: {
    project: string;
    webhook: string;
  };
}

const getData = async ({ currentPage, perPage, increment, ids }: IGetData) => {
  const { data } = await axios.get(
    `/api/projects/webhooks/${ids.project}/${ids.webhook}/analytics?page=${
      currentPage + (increment ? 1 : 0)
    }&per_page=${perPage}`
  );
  return data;
};

export default function Analytics() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [analytics, setAnalytics] = useState<WebhookAnalytic[] | []>([]);

  const params = useParams();

  const { isLoading, refetch, data, isSuccess } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["analyticsRepo"],
    queryFn: async () => {
      setCurrentPage((prev) => {
        return prev + 1;
      });

      const data = await getData({
        currentPage,
        perPage: 50,
        increment: true,
        ids: {
          project: params.id as string,
          webhook: params.webhookId as string,
        },
      });

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching analytics!");
      }

      toast.error(
        "Something went wrong while fetching analytics! Please try again later."
      );
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setAnalytics(data.analytics);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (data) {
      setAnalytics(data.analytics);
    }
  }, [data]);

  return (
    <div>
      <Accordion type="single" collapsible>
        {analytics?.map((analytic) => (
          <AccordionItem value={analytic.id} key={analytic.id}>
            <AccordionTrigger>{analytic.eventType}</AccordionTrigger>
            <AccordionContent>
              <span>Webhook ID: {analytic.webhookId}</span>
              <div className="w-full h-[1px] bg-zinc-600 my-2"></div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span>Event Type:</span>
                    <div className="flex items-center ml-2">
                      {analytic.eventType}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Status:</span>
                    <div className="flex items-center ml-2">
                      {analytic.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Timestmap:</span>
                    <div className="flex items-center ml-2">
                      {analytic.timestamp}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>Endpoint</span>
                    <div className="flex items-center ml-2">
                      {analytic.endpoint}
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <span>Body:</span>
                  <div className="flex items-center w-full mt-2">
                    <ReactJson
                      theme="monokai"
                      style={{ borderRadius: 10, padding: 10 }}
                      src={JSON.parse(analytic.content)}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!isLoading && analytics?.length === 0 ? <p>No logs found.</p> : null}
      {analytics && !isLoading && analytics?.length !== 0 ? (
        <div className="w-full h-auto my-5 grid place-items-center">
          <Button
            variant="outline"
            isLoading={isLoading}
            onClick={() => {
              refetch().then(async (res) => {
                setAnalytics([...analytics, ...res.data.analytics]);
                await sleep(50);
                window.scrollTo(0, window.innerHeight);
              });
            }}
            disabled={
              data.totalPages === currentPage || analytics?.length === 0
            }
          >
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
}
