import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withSupabase } from "npm:@supabase/server@^1";
import { sendSequenceEmail } from "../_shared/send-email.ts";

type DenoEnv = {
    env: { get(key: string): string | undefined };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
declare const Deno: DenoEnv;

type SupabaseClient = ReturnType<typeof createClient>;

async function alreadySent(
    supabase: SupabaseClient,
    userId: string,
    type: string,
    step: number,
    refId: string | null,
): Promise<boolean> {
    const query = supabase
        .from("email_sequence_log")
        .select("id")
        .eq("user_id", userId)
        .eq("type", type)
        .eq("step", step);

    if (refId) {
        query.eq("ref_id", refId);
    } else {
        query.is("ref_id", null);
    }

    const { data } = await query.maybeSingle();
    return !!data;
}

type SendEmailPayload = {
    type: string;
    step: number;
    userId: string;
    email: string;
    locale?: string;
    propertyId?: string;
    propertyName?: string;
};

type SendEmailContext = {
    testMode: boolean;
    testWhitelist: string[];
    maxEmails: number;
    emailsSent: number;
    results: object[];
};

async function sendEmail(
    payload: SendEmailPayload,
    ctx: SendEmailContext,
): Promise<void> {
    if (ctx.emailsSent >= ctx.maxEmails) {
        ctx.results.push({
            skipped: true,
            reason: "max_emails_reached",
            ...payload,
        });
        return;
    }

    if (ctx.testMode && !ctx.testWhitelist.includes(payload.email)) {
        ctx.results.push({
            skipped: true,
            reason: "not_in_whitelist",
            email: payload.email,
            type: payload.type,
            step: payload.step,
        });
        return;
    }

    const result = await sendSequenceEmail(payload);
    ctx.results.push({
        ...result,
        email: payload.email,
        type: payload.type,
        step: payload.step,
    });
    if (result.sent) ctx.emailsSent++;
}

Deno.serve(
    withSupabase(
        { auth: ["secret:cron", "secret"] },
        async (req: Request, supaCtx) => {
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

                // Variables de entorno
                const testMode = Deno.env.get("EMAIL_TEST_MODE") === "true";
                const testWhitelist = (
                    Deno.env.get("EMAIL_TEST_WHITELIST") ?? ""
                )
                    .split(",")
                    .map((e) => e.trim())
                    .filter(Boolean);
                const maxEmails = parseInt(
                    Deno.env.get("MAX_EMAILS_PER_RUN") ?? "50",
                    10,
                );

                // Sin daysOffset — en prod usamos días reales
                const daysOffset = 0;

                const supabase = supaCtx.supabaseAdmin;

                const ctx: SendEmailContext = {
                    testMode,
                    testWhitelist,
                    maxEmails,
                    emailsSent: 0,
                    results: [],
                };

                // ─────────────────────────────────────────
                // TIPO A — Usuarios sin propiedad
                // ─────────────────────────────────────────
                const { data: noPropertyUsers, error: errorA } =
                    await supabase.rpc("get_users_without_property", {
                        days_offset: daysOffset,
                    });

                if (errorA) console.error("Error tipo A:", errorA);

                for (const user of noPropertyUsers ?? []) {
                    if (ctx.emailsSent >= maxEmails) break;

                    const sentA1 = await alreadySent(
                        supabase,
                        user.id,
                        "no_property",
                        1,
                        null,
                    );

                    // A1 — día 2
                    if (user.days_since_register >= 2 && !sentA1) {
                        await sendEmail(
                            {
                                type: "no_property",
                                step: 1,
                                userId: user.id,
                                email: user.email,
                                locale: user.locale ?? "en",
                            },
                            ctx,
                        );
                        // A1 se acaba de enviar — no procesamos A2 en esta misma ejecución
                        continue;
                    }

                    // A2 — día 7, solo si A1 ya fue enviado en una ejecución anterior
                    if (user.days_since_register >= 7 && sentA1) {
                        const sentA2 = await alreadySent(
                            supabase,
                            user.id,
                            "no_property",
                            2,
                            null,
                        );
                        if (!sentA2) {
                            await sendEmail(
                                {
                                    type: "no_property",
                                    step: 2,
                                    userId: user.id,
                                    email: user.email,
                                    locale: user.locale ?? "en",
                                },
                                ctx,
                            );
                        }
                    }
                }

                // ─────────────────────────────────────────
                // TIPO B — Propiedades incompletas
                // ─────────────────────────────────────────
                const { data: incompleteProperties, error: errorB } =
                    await supabase.rpc("get_incomplete_properties", {
                        days_offset: daysOffset,
                    });

                if (errorB) console.error("Error tipo B:", errorB);

                for (const prop of incompleteProperties ?? []) {
                    if (ctx.emailsSent >= maxEmails) break;

                    // B1 — día 3
                    if (prop.days_since_created >= 3) {
                        const sent = await alreadySent(
                            supabase,
                            prop.user_id,
                            "incomplete_property",
                            1,
                            prop.property_id,
                        );
                        if (!sent) {
                            await sendEmail(
                                {
                                    type: "incomplete_property",
                                    step: 1,
                                    userId: prop.user_id,
                                    email: prop.email,
                                    locale: prop.locale ?? "en",
                                    propertyId: prop.property_id,
                                    propertyName: prop.property_name,
                                },
                                ctx,
                            );
                        }
                    }

                    // B2 — día 14, solo si B1 ya fue enviado
                    if (prop.days_since_created >= 14) {
                        const sentB1 = await alreadySent(
                            supabase,
                            prop.user_id,
                            "incomplete_property",
                            1,
                            prop.property_id,
                        );
                        const sentB2 = await alreadySent(
                            supabase,
                            prop.user_id,
                            "incomplete_property",
                            2,
                            prop.property_id,
                        );
                        if (sentB1 && !sentB2) {
                            await sendEmail(
                                {
                                    type: "incomplete_property",
                                    step: 2,
                                    userId: prop.user_id,
                                    email: prop.email,
                                    locale: prop.locale ?? "en",
                                    propertyId: prop.property_id,
                                    propertyName: prop.property_name,
                                },
                                ctx,
                            );
                        }
                    }
                }

                // ─────────────────────────────────────────
                // TIPO C — Propiedades sin etiquetas
                // ─────────────────────────────────────────
                const { data: noFeaturedProperties, error: errorC } =
                    await supabase.rpc("get_properties_without_featured", {
                        days_offset: daysOffset,
                    });

                if (errorC) console.error("Error tipo C:", errorC);

                // Opción B — máximo un C1 por usuario
                // Tracking de usuarios que ya recibieron C1 en esta ejecución
                const usersAlreadySentC1 = new Set<string>();

                for (const prop of noFeaturedProperties ?? []) {
                    if (ctx.emailsSent >= maxEmails) break;

                    // Si ya enviamos C1 a este usuario en esta ejecución, saltamos
                    if (usersAlreadySentC1.has(prop.user_id)) {
                        ctx.results.push({
                            skipped: true,
                            reason: "c1_already_sent_to_user",
                            type: "no_featured",
                            step: 1,
                            email: prop.email,
                        });
                        continue;
                    }

                    // Opción A — Prioridad: si la propiedad está incompleta no enviamos C1
                    const isIncomplete = incompleteProperties?.some(
                        (p: { property_id: string }) =>
                            p.property_id === prop.property_id,
                    );
                    if (isIncomplete) {
                        ctx.results.push({
                            skipped: true,
                            reason: "property_incomplete_has_priority",
                            type: "no_featured",
                            step: 1,
                            email: prop.email,
                        });
                        continue;
                    }

                    // C1 — día 5, una sola vez por propiedad
                    if (prop.days_since_created >= 5) {
                        const sent = await alreadySent(
                            supabase,
                            prop.user_id,
                            "no_featured",
                            1,
                            prop.property_id,
                        );
                        if (!sent) {
                            await sendEmail(
                                {
                                    type: "no_featured",
                                    step: 1,
                                    userId: prop.user_id,
                                    email: prop.email,
                                    locale: prop.locale ?? "en",
                                    propertyId: prop.property_id,
                                    propertyName: prop.property_name,
                                },
                                ctx,
                            );
                            // Marcar usuario como ya notificado en esta ejecución
                            usersAlreadySentC1.add(prop.user_id);
                        }
                    }
                }

                return new Response(
                    JSON.stringify({
                        ok: true,
                        emailsSent: ctx.emailsSent,
                        testMode,
                        results: ctx.results,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
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
