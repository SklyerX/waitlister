import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectValidator } from "@/lib/validators/project";
import { ZodError } from "zod";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { Cypher } from "@sklyerx/cypher";

const cypher = new Cypher({
  appId:
    "cyApp:v1:eyJhbGciOiJIUzI1NiJ9.MzI5OWQ0MDYyYzY2NTM3ZTU2NmVhMzQzMmJjZTQ4ZTE.I4mvZT4WGelOXGKluGAGToMHfl0WTzz0a1k4hgieDr4",
  appSecret:
    "pss:v1:eyJhbGciOiJIUzI1NiJ9.MDI1OTkyMzllNDIzYmRiNjRmZjczMDg1ZGY0Mzk4MmUwNDcwMGI0MmM1OGFjMTczOTUyODFkNjRhZjBhNThmNg.HumiDGQOYSaRNksoLO3V7oelSMEBEkfnI00krDCuiDg",
  JWT_SECRET: "8dTs1ZPK_tlbQZFTa_B",
});

export interface DBOutput {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = ProjectValidator.parse(body);

    let projectId = nanoid(20);
    const projectSecret = crypto.randomBytes(32).toString("hex");

    const newProject = await db.project.create({
      data: {
        name,
        projectId,
        projectSecret: await cypher.encrypt(`sk_${projectSecret}`),
        userId: session.user.id,
      },
    });

    return new Response(
      JSON.stringify({
        id: newProject.projectId,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while creating a new project!", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify(projects), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching projects!", {
      status: 500,
    });
  }
}
