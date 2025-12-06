import { IUserLogin } from "@common/types/src/types";
import { object, string, ObjectSchema } from "yup";

export const loginSchema: ObjectSchema<IUserLogin> = object({
  username: string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .required("Username is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Password is required"),
});
