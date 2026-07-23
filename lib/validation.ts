import { z } from "zod";
import { NextResponse } from "next/server";

export function validate<T>(
    schema: z.ZodSchema<T>,
    body: unknown
) {
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return {
            success: false,
            response: NextResponse.json(
                {
                    success: false,
                    errors: parsed.error.flatten(),
                },
                {
                    status: 400,
                }
            ),
        };
    }

    return {
        success: true,
        data: parsed.data,
    };
}