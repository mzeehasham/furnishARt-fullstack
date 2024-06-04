"use client";
import { ErrorMessageToast } from "@/components/common/ErrorMessageToast";
import { SigninUser } from "@/services/Auth";
import { LoginFormSchema } from "@/utils/FormValidations/ValidationSchemas";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoAt } from "react-icons/io5";
import { TbPasswordFingerprint } from "react-icons/tb";
import { MyPasswordInput } from "../common/FormFields/MyPasswordInput";
import { MyTextInput } from "../common/FormFields/MyTextInput";
import GradientButton from "../common/buttons/GradientButton";

const LoginForm = () => {
  const saerchParams = useSearchParams();
  const initialValues = {
    username_or_email: "",
    password: "",
  };

  const [errorMessage, setErrorMessage] = useState("");
  const callbackUrl = saerchParams?.get("callbackUrl");
  const { mutate, isPending } = useMutation({ mutationFn: SigninUser });

  const handlerLogin = async (values: typeof initialValues) => {
    const { username_or_email, password } = values;
    mutate(
      { username_or_email, password },
      {
        onSuccess: (statusCode) => {
          window.location.href = callbackUrl || "/";
          // if (statusCode === 403) {
          //   setErrorMessage("Please verify your email address");
           // window.location.href = '/verify-email';
          // } else {
          // }
        },
        onError: (error) => {
          setErrorMessage(error.message);
          console.error(error.message, "login error");
        },
      }
    );
  };

  return (
    <>
      <Formik
        onSubmit={handlerLogin}
        validationSchema={LoginFormSchema}
        initialValues={initialValues}
      >
        {({ errors, touched, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="mt-8">
            <ErrorMessageToast
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
            />
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username_or_email"
                  className="text-base font-medium text-gray-900"
                >
                  Email address or Username
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div
                    className={`${
                      touched.username_or_email && errors.username_or_email
                        ? "top-5"
                        : "inset-y-0 items-center"
                    } absolute left-0 flex pl-3 pointer-events-none`}
                  >
                    <IoAt className="w-5 h-5" />
                                      </div>

                  <MyTextInput
                    id="username_or_email"
                    name="username_or_email"
                    type="text"
                    placeholder="Enter username or email to get started"
                    className={`${
                      touched.username_or_email && errors.username_or_email
                        ? "border-2 border-red-600 focus:border-red-600 focus:ring-0"
                        : "focus:border-blue-600 caret-blue-600 border border-gray-200"
                    }
             block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 focus:bg-white  rounded-md bg-gray-50 focus:outline-none placeholder:text-sm`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <Link
                    href="/forget-password"
                    className="text-sm font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                  >
                    {" "}
                    Forgot password?{" "}
                  </Link>
                </div>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div
                    className={`${
                      touched.password && errors.password
                        ? "top-5"
                        : "inset-y-0 items-center"
                    } absolute left-0 flex pl-3 pointer-events-none`}
                  >
                    <TbPasswordFingerprint className="w-5 h-5" />
                  </div>
                  <MyPasswordInput
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className={`${
                      touched.password && errors.password
                        ? "border-2 border-red-600 focus:border-red-600 focus:ring-0"
                        : "focus:border-blue-600 caret-blue-600 border border-gray-200"
                    } block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 rounded-md bg-gray-50 focus:outline-none focus:bg-white placeholder:text-sm`}
                  />
                </div>
              </div>
              <GradientButton type="submit" disabled={isPending}>
                Login
              </GradientButton>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
