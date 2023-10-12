import { DBOutput } from "@/app/api/projects/route";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

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

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 200;

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

    let limit: number = per_page;

    if (limit > 200) limit = 200;

    const skip = Math.max((page - 1) * limit, 0);

    const totalCount = (
      await db.webhookAnalytic.findMany({
        where: {
          webhookId: params.webhookId,
        },
      })
    ).length;

    const totalPages = Math.ceil(totalCount / limit);

    const analytics = await db.webhookAnalytic.findMany({
      skip,
      take: limit,
      where: {
        webhookId: webhook.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        analytics,
        totalPages,
        totalCount,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching projects!", {
      status: 500,
    });
  }
}
