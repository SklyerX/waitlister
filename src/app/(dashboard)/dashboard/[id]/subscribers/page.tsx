"use client";

import DeleteEmail from "@/components/dialogs/delete-email";
import EmailForm from "@/components/forms/add-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sleep } from "@/lib/utils";
import { Subscriber } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PER_PAGE = 200;

const getData = async (page: number, increment = true, id: string) => {
  const { data } = await axios.get(
    `/api/projects/subscribers?page=${
      page + (increment ? 1 : 0)
    }&per_page=${PER_PAGE}`,
    {
      headers: {
        "x-project-id": id,
      },
    }
  );
  return data;
};

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Array<Subscriber> | []>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const params = useParams();

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["subscribersInfoRepo"],
    queryFn: async () => {
      setPage(page + 1);
      const data = await getData(page, true, params.id as string);
      return data;
    },
    onError: (err) => {
      console.log(err);
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching subscribers!");
      }

      toast.error(
        "Something went wrong while fetching subscribers! Please try again later."
      );
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setSubscribers(data.subscribers);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  return (
    <div className="container mt-10">
      <h3 className="text-lg font-medium">Subscribers</h3>
      <p className="text-muted-foreground/70 text-sm mb-5">
        View all subscribers to your waitlist.
      </p>
      <div className="w-full border bg-background-50 my-10 flex items-center justify-between rounded-md p-4">
        <span>Add a subscriber to your waitlist manually.</span>
        <EmailForm
          onSuccess={async () => {
            const data = await getData(1, false, params.id as string);
            setSubscribers([data.subscribers[0], ...subscribers]);
            setTotalPages(data.totalPages);
          }}
        />
      </div>
      <div className="text-lg my-4">
        Here are your most recent 200 subscribers.
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subscribed</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Referrer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers?.map((sub) => {
            const date = new Date(sub.createdAt);
            return (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell className="text-muted-foreground/70">
                  {sub.name || "Unknown"}
                </TableCell>
                <TableCell className="text-muted-foreground/70">
                  {sub.phone || "Unknown"}
                </TableCell>
                <TableCell className="text-muted-foreground/70">
                  <span className="mx-0.5">{date.getDate()}</span>
                  <span className="mx-0.5">{date.getMonth()}</span>
                  <span className="mx-0.5">{date.getFullYear()}</span>
                </TableCell>
                <TableCell className="text-muted-foreground/70">
                  {sub.referals}
                </TableCell>
                <TableCell className="text-muted-foreground/70">
                  {sub.referalCode}
                </TableCell>
                <TableCell className="text-muted-foreground/70">
                  {sub.referedBy || "Unknown"}
                </TableCell>
                <TableCell>
                  <DeleteEmail
                    id={sub.id}
                    onDelete={() => {
                      setSubscribers(
                        subscribers.filter((x) => x.email !== sub.email)
                      );
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {subscribers && !isLoading && subscribers?.length !== 0 ? (
        <div className="w-full h-auto my-5 grid place-items-center">
          <Button
            variant="outline"
            isLoading={isLoading}
            onClick={() => {
              refetch().then(async (res) => {
                setSubscribers([...subscribers, ...res.data.subscribers]);
                await sleep(50);
                window.scrollTo(0, window.innerHeight);
              });
            }}
            disabled={totalPages === page || subscribers?.length === 0}
          >
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
}
