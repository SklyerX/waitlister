import { getAuthSession } from "@/lib/auth";
import { DBOutput } from "../../route";
import { db } from "@/lib/db";
import { secureCompare } from "@/lib/utils";
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
  };
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const projectId = req.headers.get("x-project-id");
    const projectSecret = req.headers.get("x-project-secret");

    const session = (await getAuthSession()) as DBOutput | null;

    if (!projectId) {
      return new Response("Unauthorized - Missing header", { status: 401 });
    }

    const project = await db.project.findFirst({
      where: {
        projectId,
      },
    });

    if (!project)
      return new Response("Invalid project credentials", {
        status: 401,
      });

    const origin = req.headers.get("origin");

    if (!session && origin && project?.domains.includes(origin)) {
      const sub = await db.subscriber.findFirst({
        where: {
          id: params.id,
          projectId,
        },
      });

      if (!sub) return new Response("Subscriber not found!", { status: 404 });

      if (sub.referedBy) {
        console.log(`REFERED BY ${sub.referedBy} ${sub.referalCode}`);

        const user = await db.subscriber.findFirst({
          where: {
            referalCode: sub.referedBy,
          },
        });

        if (user) {
          console.log(sub.referedBy);

          await db.subscriber.update({
            where: {
              id: user.id,
            },
            data: {
              referals: {
                decrement: 1,
              },
            },
          });
        }
      }

      await db.subscriber.delete({
        where: {
          id: sub.id,
          projectId,
        },
      });

      return new Response("Removed subscriber", { status: 200 });
    } else if (origin && !project?.domains.includes(origin)) {
      const decryptedSecret = await cypher.decrypt(project.projectSecret);

      if (!session && !projectSecret) {
        return new Response("Unauthorized - Missing headers", { status: 401 });
      }

      if (!session) {
        if (!secureCompare(decryptedSecret, projectSecret as string))
          return new Response("Invalid project credentials", {
            status: 401,
          });

        const sub = await db.subscriber.findFirst({
          where: {
            id: params.id,
            projectId,
          },
        });

        if (!sub) return new Response("Subscriber not found!", { status: 404 });

        if (sub.referedBy) {
          console.log(`REFERED BY ${sub.referedBy} ${sub.referalCode}`);
          const user = await db.subscriber.findFirst({
            where: {
              referalCode: sub.referedBy,
            },
          });

          if (user) {
            console.log(sub.referedBy);
            await db.subscriber.update({
              where: {
                id: user.id,
              },
              data: {
                referals: {
                  decrement: 1,
                },
              },
            });
          }
        }

        await db.subscriber.delete({
          where: {
            id: sub.id,
            projectId,
          },
        });

        return new Response("Removed subscriber", { status: 200 });
      }
    }

    const sub = await db.subscriber.findFirst({
      where: {
        id: params.id,
        projectId,
      },
    });

    if (!sub) return new Response("Subscriber not found!", { status: 404 });

    if (sub.referedBy) {
      console.log(`REFERED BY ${sub.referedBy} ${sub.referalCode}`);
      const user = await db.subscriber.findFirst({
        where: {
          referalCode: sub.referedBy,
        },
      });

      if (user) {
        console.log(sub.referedBy);

        await db.subscriber.update({
          where: {
            id: user.id,
          },
          data: {
            referals: {
              decrement: 1,
            },
          },
        });
      }
    }

    await db.subscriber.delete({
      where: {
        id: sub.id,
        projectId,
      },
    });

    return new Response("Removed subscriber", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching subscribers!", {
      status: 500,
    });
  }
}
