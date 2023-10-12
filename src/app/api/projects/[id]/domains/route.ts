// TODO: change it to make it user the headers "x-waitlist-id" "x-waitlist-secret" and find the projectId through that.

import { getAuthSession } from "@/lib/auth";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { DomainValidator } from "@/lib/validators/domain";
import { DBOutput } from "../../route";

interface Props {
  params: {
    id: string;
  };
}

export async function POST(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { url } = DomainValidator.parse(body);

    const data = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    if (!data) return new Response("Project not found!", { status: 404 });

    const domain = !data?.domains
      ? -1
      : data.domains.findIndex((x) => x === url);

    if (domain !== -1)
      return new Response("Domain already exists!", { status: 409 });

    await db.project.update({
      where: {
        id: data.id,
      },
      data: {
        domains: {
          push: url,
        },
      },
    });

    return new Response("New domain whitelisted", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while whitelisting domain!", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);

    const { url } = DomainValidator.parse({
      url: searchParams.get("url"),
    });

    const data = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    if (!data) return new Response("Project not found!", { status: 404 });

    const domain = !data?.domains
      ? -1
      : data.domains.findIndex((x) => x === url);

    if (domain === -1)
      return new Response("Domain does not exists!", { status: 409 });

    const urls = data?.domains.filter((x) => x !== url);

    await db.project.update({
      where: {
        id: data.id,
      },
      data: {
        domains: {
          set: urls,
        },
      },
    });

    return new Response("Domain Removed", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while removing domain", {
      status: 500,
    });
  }
}

export async function GET(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    return new Response(JSON.stringify(data?.domains.reverse()), {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while removing domain", {
      status: 500,
    });
  }
}
