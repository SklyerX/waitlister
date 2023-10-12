import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Cypher } from "@sklyerx/cypher";
import crypto from "crypto";
import { DBOutput } from "../../route";

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

    const decryptedSecret = await cypher.decrypt(project.projectSecret);

    return new Response(
      JSON.stringify({ projectId: params.id, projectSecret: decryptedSecret }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      "Something went wrong while refreshing project secret!",
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const project_secret = crypto.randomBytes(32).toString("hex");

    await db.project.update({
      where: {
        id: params.id,
      },
      data: {
        projectSecret: await cypher.encrypt(project_secret),
      },
    });

    return new Response("Secret Updated", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      "Something went wrong while refreshing project secret!",
      {
        status: 500,
      }
    );
  }
}
