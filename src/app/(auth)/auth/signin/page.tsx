"use client";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoEye, IoEyeOff } from "react-icons/io5";
interface SignInProps {}

type FormData = z.infer<typeof loginSchema>;
const SignIn: FC<SignInProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Berhasil login");
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message); // Tangani error jika ada
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    }
  };
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="bg-auth-img h-screen w-full img bg-no-repeat bg-cover flex justify-center items-center">
      <Card className="card w-[450px] h-[320px] mx-auto p-3">
        <CardHeader>
          <h1 className="font-bold text-2xl text-center mx-auto mb-5">
            Selamat datang di sistem HRIS
          </h1>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between h-full"
          >
            <div className="flex flex-col">
              <div className="relative mb-8">
                <Input
                  isClearable
                  placeholder="Email"
                  {...register("email")}
                  color={errors.email ? "danger" : "default"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  {...register("password")}
                  color={errors.password ? "danger" : "default"}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <IoEye className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Spacer y={1} />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Masuk
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignIn;
