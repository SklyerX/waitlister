import { getAuthSession } from "@/lib/auth";
import { DBOutput } from "../../../route";
import { db } from "@/lib/db";
import { Cypher } from "@sklyerx/cypher";

const cypher = new Cypher({
  appId:
    "cyApp:v1:eyJhbGciOiJIUzI1NiJ9.MzI5OWQ0MDYyYzY2NTM3ZTU2NmVhMzQzMmJjZTQ4ZTE.I4mvZT4WGelOXGKluGAGToMHfl0WTzz0a1k4hgieDr4",
  appSecret:
    "pss:v1:eyJhbGciOiJIUzI1NiJ9.MDI1OTkyMzllNDIzYmRiNjRmZjczMDg1ZGY0Mzk4MmUwNDcwMGI0MmM1OGFjMTczOTUyODFkNjRhZjBhNThmNg.HumiDGQOYSaRNksoLO3V7oelSMEBEkfnI00krDCuiDg",
  JWT_SECRET: "8dTs1ZPK_tlbQZFTa_B",
});

interface Props {
  params: {
    id: string;
    webhookId: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const project = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    if (!project)
      return new Response("Invalid project credentials", {
        status: 401,
      });

    const webhook = await db.webhook.findFirst({
      where: {
        projectId: params.id,
        id: params.webhookId,
      },
    });

    if (!webhook)
      return new Response("A webhook with this id was not found!", {
        status: 404,
      });

    return new Response(
      JSON.stringify({
        ...webhook,
        signingSecret: await cypher.decrypt(webhook.signginSecret),
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching webhook!", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const project = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    if (!project)
      return new Response("Invalid project credentials", {
        status: 401,
      });

    const webhook = await db.webhook.delete({
      where: {
        projectId: params.id,
        id: params.webhookId,
      },
    });

    if (!webhook)
      return new Response("A webhook with this id was not found!", {
        status: 404,
      });

    await db.webhookAnalytic.deleteMany({
      where: {
        webhookId: params.webhookId,
      },
    });

    return new Response("Successfully deleted", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting webhook!", {
      status: 500,
    });
  }
}
