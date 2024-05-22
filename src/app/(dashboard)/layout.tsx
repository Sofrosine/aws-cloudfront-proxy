"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import useAuthStore from "@/store/authStore";
import useAmazonCognito from "@/hooks/useAmazonCognito";
import { checkRouteExist } from "@/utils";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { data } = useAuthStore();

  const { refreshToken } = useAmazonCognito();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname]);

  const getUser = () => {
    setLoading(true);

    refreshToken()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        if (checkRouteExist(pathname) || pathname === "") {
          router.push("/login");
        } else {
          setLoading(false);
        }
      });
  };

  if (loading) return <></>;
  return children;
};

export default Layout;
