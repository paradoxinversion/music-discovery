"use client";
import { Formik, Field } from "formik";
import { useRouter } from "next/navigation";
import { Button, ErrorText } from "@mda/components";
import axiosInstance from "../../util/axiosInstance";
import * as Yup from "yup";

interface SignUpFormValues {
  email: string;
  username: string;
  password: string;
}

const signUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Password is required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const initialValues: SignUpFormValues = {
    email: "",
    username: "",
    password: "",
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center py-2 w-full">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={signUpSchema}
        onSubmit={async (values) => {
          try {
            // TODO: Automatically log in the user after signup
            await axiosInstance.post("/auth/sign-up", values);
            router.push("/login");
          } catch (error) {
            console.error("Signup error:", error.response.data);
          }
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <label htmlFor="email">Email</label>
            <Field id="email" type="email" name="email" />
            {errors.email && touched.email ? (
              <ErrorText message={errors.email} />
            ) : null}
            <label htmlFor="username">Username</label>
            <Field id="username" type="text" name="username" />
            {errors.username && touched.username ? (
              <ErrorText message={errors.username} />
            ) : null}
            <label htmlFor="password">Password</label>
            <Field id="password" type="password" name="password" />
            {errors.password && touched.password ? (
              <ErrorText message={errors.password} />
            ) : null}
            <Button type="submit" label="Sign Up" />
          </form>
        )}
      </Formik>
    </div>
  );
}
