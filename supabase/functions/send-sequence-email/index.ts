import { withSupabase } from "npm:@supabase/server@^1";
import { sendSequenceEmail } from "../_shared/send-email.ts";

type DenoEnv = {
    env: { get(key: string): string | undefined };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
declare const Deno: DenoEnv;

Deno.serve(
    withSupabase(
        { auth: ["secret:cron", "secret"] },
        async (req: Request, ctx) => {
            try {
                if (req.method !== "POST") {
                    return new Response(
                        JSON.stringify({ error: "Method not allowed" }),
                        {
                            status: 405,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }

                const body = (await req.json()) as {
                    type: string;
                    step: number;
                    userId: string;
                    email: string;
                    locale?: string;
                    propertyId?: string;
                    propertyName?: string;
                };

                const {
                    type,
                    step,
                    userId,
                    email,
                    locale,
                    propertyId,
                    propertyName,
                } = body;

                if (!type || !step || !userId || !email) {
                    return new Response(
                        JSON.stringify({ error: "Missing required fields" }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }

                const result = await sendSequenceEmail({
                    type,
                    step,
                    userId,
                    email,
                    locale,
                    propertyId,
                    propertyName,
                });

                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error: unknown) {
                let message = "Unknown error";
                if (error && typeof error === "object" && "message" in error) {
                    const maybeError = error as { message?: unknown };
                    message =
                        typeof maybeError.message === "string"
                            ? maybeError.message
                            : "Unknown error";
                }
                return new Response(JSON.stringify({ error: message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        },
    ),
);
