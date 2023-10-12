import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DBOutput } from "../../route";
import { months } from "@/lib/constants";

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

    const subs = await db.subscriber.findMany({
      where: {
        projectId: project.projectId,
      },
      orderBy: {
        id: "desc",
      },
    });

    let totalReferals = 0;

    const lastSubDate = subs.length !== 0 ? subs[0].createdAt : null,
      totalSubs = subs.length;

    const activity = createActivitiesLayout();

    if (subs.length !== 0) {
      subs.map((sub) => {
        const extractedMonth = new Date(sub.createdAt).getMonth() + 1; // because it starts at 0 for jan :(

        const indexOfMonth = months.findIndex(
          (x) => x.month_number === extractedMonth
        );

        if (activity[months[indexOfMonth].month]) {
          activity[months[indexOfMonth].month] += 1;
        } else {
          activity[months[indexOfMonth].month] = 1;
        }

        totalReferals += sub.referals;
      });
    }

    return new Response(
      JSON.stringify({ activity, lastSubDate, totalSubs, totalReferals })
    );
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching overview", {
      status: 500,
    });
  }
}

function createActivitiesLayout() {
  const obj: { [month: string]: number } = {};

  months.map((item) => {
    obj[item.month] = 0;
  });

  return obj;
}
