import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectValidator } from "@/lib/validators/project";
import { DBOutput } from "../route";
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

    if (!project) return new Response("Project not found!", { status: 404 });

    return new Response(
      JSON.stringify({
        name: project.name,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting project!");
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

    if (!project) return new Response("Project not found!", { status: 404 });

    await db.project.delete({
      where: {
        id: project.id,
      },
    });

    const webhooks = await db.webhook.findMany({
      where: {
        projectId: project.id,
      },
    });

    webhooks.map(async (webhook) => {
      await db.webhookAnalytic.deleteMany({
        where: {
          id: webhook.id,
        },
      });
    });

    await db.webhook.deleteMany({
      where: {
        projectId: project.id,
      },
    });

    await db.subscriber.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    return new Response("Successfully deleted project", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting project!");
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = ProjectValidator.parse(body);

    const project = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });

    if (!project) return new Response("Project not found!", { status: 404 });

    await db.project.update({
      where: {
        id: project.id,
      },
      data: {
        name,
      },
    });

    return new Response("Successfully updated project", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting project!");
  }
}
