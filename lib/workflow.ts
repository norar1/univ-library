import { Client as workflowClient } from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QstashClient, resend } from "@upstash/qstash";
export const workflowclient = new workflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QstashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "King Norar <hello.norardavid.xyz>",
      to: [email],
      subject,
      html: message,
    },
  });
};
