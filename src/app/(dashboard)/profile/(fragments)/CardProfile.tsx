"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import cognitoUser from "@/config/aws/cognitoUser";
import useAmazonCognito from "@/hooks/useAmazonCognito";
import useAuthStore from "@/store/authStore";
import { useErrorStore } from "@/store/errorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import dayjs from "dayjs";

const loginSchema = z.object({
  phone_number: z.string().min(1, { message: "Phone number is required" }),
});

type LoginInput = TypeOf<typeof loginSchema>;

const CardProfile = () => {
  const errorStore = useErrorStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const { setData, data } = authStore || {};

  const [loading, setLoading] = useState(false);

  const captchaRef = useRef<any>(null);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone_number: "",
    },
  });
  const { handleSubmit, setValue, watch } = methods;

  const { logout } = useAmazonCognito();

  useEffect(() => {
    if (data?.phone_number) {
      setValue("phone_number", data?.phone_number?.slice(1) ?? "");
    }
  }, [data]);

  const _onSubmit = async (values: any) => {
    // const token = captchaRef?.current?.getValue();
    // if (token) {
    setLoading(true);
    try {
      cognitoUser().getUserAttributes((err, attr) => {
        if (!err) {
          if (
            attr?.findIndex((val) => val?.Name === "phone_number") !==
              undefined &&
            attr?.findIndex((val) => val?.Name === "phone_number") !== -1
          ) {
            attr[
              attr?.findIndex((val) => val?.Name === "phone_number")
            ].Value = `+${watch("phone_number")}`;
          } else {
            const phoneAttr: CognitoUserAttribute = new CognitoUserAttribute({
              Name: "phone_number",
              Value: `+${watch("phone_number")}`,
            });
            attr?.push(phoneAttr);
          }
          attr = attr?.filter((val) => val?.Name !== "phone_number_verified");
          attr = attr?.filter((val) => val?.Name !== "email_verified");
          attr = attr?.filter((val) => val?.Name !== "sub");

          cognitoUser().updateAttributes(
            attr || [],
            function (err, result) {
              if (err) {
                // alert(err.message || JSON.stringify(err));
                console.log("ERROR UPDATE", err);
                errorStore?.setMessage("Max attempt has been reached." || "");
                setLoading(false);
                return;
              }
              alert(result);

              cognitoUser().getUserAttributes((err, attr) => {
                if (!err) {
                  if (
                    attr?.findIndex(
                      (val) => val?.Name === "custom:PhoneUpdateCount"
                    ) !== undefined &&
                    attr?.findIndex(
                      (val) => val?.Name === "custom:PhoneUpdateCount"
                    ) !== -1
                  ) {
                    setData({
                      ...data,
                      phone_number: `+${watch("phone_number")}`,
                      "custom:PhoneUpdateCount":
                        attr[
                          attr?.findIndex(
                            (val) => val?.Name === "custom:PhoneUpdateCount"
                          )
                        ]?.Value,
                    });
                  }
                }
              });
            },
            {
              ClientId: "5r1u2dqt5rk325jrlqq7n8njcg",
              Username: data["cognito:username"],
            }
          );
          setLoading(false);
        } else {
          console.log("=== ERROR GET === ", err);
          errorStore?.setMessage(err?.message ?? "");
          setLoading(false);
        }
      });
      // const res: any = await login(values?.username, values?.password);
      // setData(res?.data?.getIdToken().payload);
      // router.push("/profile");
    } catch (error: any) {
      console.log("=== ERROR 2 === ", error);
      errorStore?.setMessage(error?.message ?? "");
      setLoading(false);
    } finally {
      // setLoading(false);
    }
    // } else {
    //   errorStore.setMessage("CAPTCHA Required");
    //   // captchaRef?.current?.reset();
    // }

    // await cognitoUser().getAttributeVerificationCode("email", {
    //   onSuccess: () => {
    //     console.log("Verification code sent successfully");
    //     // Handle success
    //   },
    //   onFailure: (err) => {
    //     console.error("Error sending verification code:", err);
    //     // Handle error
    //   },
    // });
  };

  return (
    <div className="bg-white-06 rounded-2xl border-2 border-primary-white px-8 pt-8 pb-10 shadow-xl w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 z-50">
      <div className="flex items-center justify-center gap-2 px-12 mb-8">
        <span className="text-subtitle-3 font-bold text-primary">Profile</span>
      </div>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(_onSubmit)}
        >
          <div className="relative">
            <Input
              label="Phone Number"
              placeholder="Input phone number"
              type="phone_number"
              name="phone_number"
              className="pl-14"
              icon={
                <Image
                  src={"/icons/IcCallGreen.svg"}
                  height={24}
                  width={24}
                  alt="envelope"
                />
              }
              setValue={setValue}
            />
            <p className="absolute left-8 top-6 text-xl">+</p>
          </div>
          {data?.["custom:PhoneUpdateCount"] ? (
            <p>
              PhoneUpdateCount: <br />
              {JSON.parse(data?.["custom:PhoneUpdateCount"])?.map(
                (val: string) => {
                  return (
                    <p key={val}>
                      - {dayjs(val).format("DD MMMM YYYY HH:mm:ss")}
                    </p>
                  );
                }
              )}
            </p>
          ) : (
            <div />
          )}
          {/* <ReCAPTCHA
            sitekey="6LeSPNopAAAAAJ6J-3ke0dy1oanlVBEi_bH_v1QG"
            ref={captchaRef}
          /> */}
          <div className="flex flex-col gap-4">
            <Button type="submit" loading={loading}>
              Update
            </Button>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CardProfile;
