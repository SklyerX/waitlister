import { getAuthSession } from "@/lib/auth";
import { DBOutput } from "../../route";
import { db } from "@/lib/db";
import { z } from "zod";
import { nanoid } from "nanoid";
import { Subscriber } from "@prisma/client";
import _ from "lodash";

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
    const { emails } = z
      .object({ emails: z.string().email().array() })
      .parse(body);

    const project = await db.project.findFirst({
      where: {
        projectId: params.id,
      },
    });
    if (!project) return new Response("Project not found!", { status: 404 });

    const subscribers = await db.subscriber.findMany({
      where: {
        projectId: params.id,
      },
    });

    console.log(subscribers);

    const formattedEmails: Omit<Subscriber, "id">[] = [];

    emails.map((email) => {
      formattedEmails.push({
        name: null,
        phone: null,
        referalCode: nanoid(20), // referal code
        referals: 0,
        createdAt: new Date(),
        projectId: params.id,
        email,
        metadata: null,
        referedBy: null,
      });
    });

    console.log(formattedEmails);

    const uniqifiedEmails = _.differenceBy(
      formattedEmails,
      subscribers,
      "email"
    );

    console.log(uniqifiedEmails);

    await db.subscriber.createMany({
      data: uniqifiedEmails,
    });

    return new Response("Successfully imported subscribers", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting project!", {
      status: 500,
    });
  }
}
