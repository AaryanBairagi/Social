import { z } from "zod";
import { NextResponse } from "next/server";

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      response: NextResponse;
    };

export function validate<T>(
  schema: z.ZodType<T>,
  body: unknown
): ValidationResult<T> {
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