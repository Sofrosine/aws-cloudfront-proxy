"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import useAmazonCognito from "@/hooks/useAmazonCognito";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginInput = TypeOf<typeof loginSchema>;

const CardLogin = () => {
  const errorStore = useErrorStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const { setData } = authStore || {};

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const { login } = useAmazonCognito();

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await login(values?.username, values?.password);

      setData(res?.data?.getIdToken().payload);
      router.push("/profile");
    } catch (error: any) {
      errorStore?.setMessage(error?.message ?? "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white-06 rounded-2xl border-2 border-primary-white px-8 pt-8 pb-10 shadow-xl w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 z-50">
      <div className="flex items-center justify-center gap-2 px-12 mb-8">
        <span className="text-subtitle-3 font-bold text-primary">Sign in</span>
      </div>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Username"
            placeholder="Input username"
            type="username"
            name="username"
            icon={
              <Image
                src={"/icons/IcUser.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            setValue={setValue}
          />
          <Input
            label="Password"
            placeholder="Input password"
            type={showPassword ? "text" : "password"}
            name="password"
            icon={
              <Image
                src={"/icons/IcLock.svg"}
                height={24}
                width={24}
                alt="envelope"
              />
            }
            iconRight={
              <Image
                src={
                  showPassword
                    ? "/icons/IcEyeOpen.svg"
                    : "/icons/IcEyeClose.svg"
                }
                height={24}
                width={24}
                alt="envelope"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer"
              />
            }
            setValue={setValue}
          />

          <Button type="submit" loading={loading}>
            Sign In
          </Button>
          <div className="flex flex-col gap-2 text-body-1 text-center">
            <p className="text-grey-2">Don’t have account?</p>
            <Link href={"/register"} className="self-center">
              <p className="hover:text-primary">Sign Up</p>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CardLogin;
