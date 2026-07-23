import { z } from "zod";
import {
    EmailSchema,
    PasswordSchema,
    UsernameSchema,
    NameSchema,
} from "./common";

export const RegisterSchema = z.object({
    firstName: NameSchema,
    lastName: NameSchema,

    username: UsernameSchema,

    email: EmailSchema,

    password: PasswordSchema,
});

export const LoginSchema = z.object({
    email: EmailSchema,

    password: PasswordSchema,
});