// TODO: check to see if request is coming from whitelisted domain,
// TODO: if it is then no need for the secret, if not then we need secret.
// TODO:  Also add userId checking to all fields

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { secureCompare } from "@/lib/utils";
import { SubscriberValidator } from "@/lib/validators/subscriber";
import { Cypher } from "@sklyerx/cypher";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { DBOutput } from "../route";
import axios from "axios";
import crypto from "crypto";

const cypher = new Cypher({
  appId:
    "cyApp:v1:eyJhbGciOiJIUzI1NiJ9.MzI5OWQ0MDYyYzY2NTM3ZTU2NmVhMzQzMmJjZTQ4ZTE.I4mvZT4WGelOXGKluGAGToMHfl0WTzz0a1k4hgieDr4",
  appSecret:
    "pss:v1:eyJhbGciOiJIUzI1NiJ9.MDI1OTkyMzllNDIzYmRiNjRmZjczMDg1ZGY0Mzk4MmUwNDcwMGI0MmM1OGFjMTczOTUyODFkNjRhZjBhNThmNg.HumiDGQOYSaRNksoLO3V7oelSMEBEkfnI00krDCuiDg",
  JWT_SECRET: "8dTs1ZPK_tlbQZFTa_B",
});

export async function POST(req: Request) {
  try {
    const projectId = req.headers.get("x-project-id");
    const projectSecret = req.headers.get("x-project-secret");

    const session = (await getAuthSession()) as DBOutput | null;

    if (!projectId) {
      return new Response("Unauthorized - Missing session", { status: 401 });
    }

    const project = await db.project.findFirst({
      where: {
        projectId,
      },
    });

    if (!project)
      return new Response("Invalid project credentials", { status: 401 });

    const body = await req.json();
    const { email, metadata, name, phone, referredBy } =
      SubscriberValidator.parse(body);

    const subscriber = await db.subscriber.findFirst({
      where: {
        projectId: projectId,
        email: email,
      },
    });

    if (subscriber) return new Response("Already subscribed", { status: 409 });

    let validReferal = false;

    if (referredBy) {
      console.log(`Found: ${referredBy}`);
      const referal = await db.subscriber.findFirst({
        where: {
          referalCode: referredBy,
          projectId,
        },
      });

      if (!referal)
        return new Response("Referal code not found!", { status: 404 });

      await db.subscriber.update({
        where: {
          id: referal.id,
          projectId,
        },
        data: {
          referals: {
            increment: 1,
          },
        },
      });

      validReferal = true;
    }

    const sub = await db.subscriber.create({
      data: {
        metadata,
        referedBy: validReferal ? referredBy : null,
        name: name ? name : null,
        phone: phone ? phone : null,
        referalCode: nanoid(20), // referal code
        referals: 0,
        createdAt: new Date(),
        projectId,
        email,
      },
    });

    // SEND WEBHOOK
    const webhooks = await db.webhook.findMany({
      where: {
        projectId,
      },
    });

    const date = new Date();

    const payload = {
      eventType: "SEND_NOTIFICATION_ON_NEW_SUBSCRIBE",
      timestamp: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      content: {
        email,
        metadata,
        name,
        phone,
        referredBy,
      },
    };

    const webhookPromises = webhooks.map(async (webhook) => {
      const webhookSigningSecret = await cypher.decrypt(webhook.signginSecret);

      const signature = crypto
        .createHmac("sha256", webhookSigningSecret)
        .update(JSON.stringify(payload))
        .digest("hex");

      try {
        await axios.post(webhook.endpoint, payload, {
          headers: {
            "X-Signature": signature,
          },
        });
        await db.webhookAnalytic.create({
          data: {
            webhookId: webhook.id,
            eventType: "SEND_NOTIFICATION_ON_NEW_SUBSCRIBE",
            timestamp: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            content: JSON.stringify({
              email,
              metadata,
              name,
              phone,
              referredBy,
              referalCode: sub.referalCode,
            }),
            endpoint: webhook.endpoint,
            status: "SUCCESS",
          },
        });
      } catch (err) {
        await db.webhookAnalytic.create({
          data: {
            webhookId: webhook.id,
            eventType: "SEND_NOTIFICATION_ON_NEW_SUBSCRIBE",
            timestamp: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            content: JSON.stringify({
              email,
              metadata,
              name,
              phone,
              referredBy,
              referalCode: sub.referalCode,
              error: err,
            }),
            endpoint: webhook.endpoint,
            status: "FAILED",
          },
        });
      }
    });

    await Promise.all(webhookPromises);

    return new Response("Successfully subscribed", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response(
      "Something went wrong while creating a new subscriber!",
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const projectId = req.headers.get("x-project-id");
    const projectSecret = req.headers.get("x-project-secret");

    const session = (await getAuthSession()) as DBOutput | null;

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 200;

    let limit: number = per_page;

    if (limit > 200) limit = 200;

    const skip = Math.max((page - 1) * limit, 0);

    if (!session) {
      if (!projectId || !projectSecret) {
        return new Response("Unauthorized - Missing headers", { status: 401 });
      }
    } else if (!projectId) {
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
      console.log("VALID DOMAIN");
      const totalCount = (
        await db.subscriber.findMany({
          where: {
            projectId,
          },
        })
      ).length;

      const totalPages = Math.ceil(totalCount / limit);

      const subscribers = await db.subscriber.findMany({
        skip,
        take: limit,
        where: {
          projectId,
        },
        orderBy: {
          id: "desc",
        },
      });

      return new Response(
        JSON.stringify({
          subscribers,
          totalPages,
          totalCount,
        }),
        { status: 200 }
      );
    } else if (origin && project?.domains.includes(origin)) {
      const decryptedSecret = await cypher.decrypt(project.projectSecret);

      if (!projectSecret) {
        return new Response("Unauthorized - Missing headers", { status: 401 });
      }

      if (!session) {
        if (!secureCompare(decryptedSecret, projectSecret as string))
          return new Response("Invalid project credentials", {
            status: 401,
          });

        const totalCount = (
          await db.subscriber.findMany({
            where: {
              projectId,
            },
          })
        ).length;

        const totalPages = Math.ceil(totalCount / limit);

        const subscribers = await db.subscriber.findMany({
          skip,
          take: limit,
          where: {
            projectId,
          },
          orderBy: {
            id: "desc",
          },
        });

        return new Response(
          JSON.stringify({
            subscribers,
            totalPages,
            totalCount,
          }),
          { status: 200 }
        );
      }
    }

    const subscribers = await db.subscriber.findMany({
      skip,
      take: limit,
      where: {
        projectId,
      },
      orderBy: {
        id: "desc",
      },
    });

    const totalCount = (
      await db.subscriber.findMany({
        where: {
          projectId,
        },
      })
    ).length;

    const totalPages = Math.ceil(totalCount / limit);

    return new Response(
      JSON.stringify({
        subscribers,
        totalPages,
        totalCount,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while fetching subscribers!", {
      status: 500,
    });
  }
}
