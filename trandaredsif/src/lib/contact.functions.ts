import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  reason: z.enum(["sponsor", "other"]),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof contactSchema>) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured. Connect Resend via Connectors.");
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured. Connect Resend via Connectors.");
    }

    const reasonLabel = data.reason === "sponsor" ? "Sponsorfråga" : "Annat/Övrigt";

    const htmlBody = `
      <h2>Nytt kontaktformulär från trandaredsif.se</h2>
      <p><strong>Kontaktanledning:</strong> ${reasonLabel}</p>
      <p><strong>Från:</strong> ${data.email}</p>
      <p><strong>Rubrik:</strong> ${data.subject}</p>
      <hr />
      <p>${data.message.replace(/\n/g, "<br />")}</p>
    `;

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Trandareds IF <onboarding@resend.dev>",
        to: ["trandaredsif@outlook.com"],
        subject: `[${reasonLabel}] ${data.subject}`,
        html: htmlBody,
        reply_to: data.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to send email [${response.status}]: ${JSON.stringify(errorData)}`
      );
    }

    return { success: true };
  });
