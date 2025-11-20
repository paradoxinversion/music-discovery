"use client";
import { useEffect } from "react";
import checkAuthentication from "../../actions/checkAuthentication";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../lib/hooks";
import { setUser } from "../../lib/features/users/userSlice";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../util/axiosInstance";
import { Button, ErrorText } from "@mda/components";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
interface LoginFormValues {
  username: string;
  password: string;
}
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthentication().then((response) => {
      if (response?.status !== 200) {
        setLoginError(response.data?.message || "Not authenticated");
        return;
      }
      const user = response.data.user;
      if (user) {
        dispatch(setUser(user));
        router.push("/discover");
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <Link href="/signup" className="mb-4 text-blue-500 underline">
        Don't have an account? Sign Up
      </Link>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          try {
            const res = await axiosInstance.post("/auth/log-in", values);
            dispatch(setUser(res.data.user));
            toast.success("Login successful!");
            router.push("/discover");
          } catch (error) {
            console.error("Login error:", error.response.data);
            setLoginError(error.response.data?.message || "Not authenticated");
            toast.error("Login failed. Please check your credentials.");
          }
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form
            className="flex flex-col space-y-4 w-80 "
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <Field
              id="username"
              name="username"
              type="text"
              placeholder="Username"
            />
            {errors.username && touched.username ? (
              <ErrorText message={errors.username} />
            ) : null}
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors.password && touched.password ? (
              <ErrorText message={errors.password} />
            ) : null}
            <Button label="Login" type="submit" />
            {loginError && <ErrorText message={loginError} />}
          </form>
        )}
      </Formik>
    </div>
  );
}
