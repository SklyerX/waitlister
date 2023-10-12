import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DBOutput } from "../route";

export async function GET(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const projectId = req.headers.get("x-project-id");

    if (!projectId)
      return new Response("Missing project id in headers", { status: 400 });

    const project = await db.project.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
    });

    if (!project)
      return new Response("Project not found!", {
        status: 404,
      });

    const webhooks = await db.webhook.findMany({
      where: {
        projectId,
      },
      orderBy: {
        id: "desc",
      },
    });

    let hooks = [];

    for (const webhook of webhooks) {
      hooks.push({
        endpoint: webhook.endpoint,
        id: webhook.id,
        description: webhook.description,
      });
    }

    console.log(hooks);

    return new Response(JSON.stringify(hooks), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching webhooks!", {
      status: 500,
    });
  }
}
