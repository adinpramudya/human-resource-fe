"use client";
import { loginSchema } from "@/lib/validation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { login } from "@/app/api/services/auth-service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
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
  //   const router = useRouter();
  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data.email, data.password);
      console.log(response);
      toast.success("Berhasil login");
      //   await router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    }
  };
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
                  isClearable
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  color={errors.password ? "danger" : "default"}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Spacer y={1} />
            <Button type="submit" color="primary" className="w-full ">
              Masuk
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignIn;
