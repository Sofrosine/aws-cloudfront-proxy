"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import useAmazonCognito from "@/hooks/useAmazonCognito";
import { NON_LOGIN_ROUTES_KEY } from "@/config/constants";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const { refreshToken } = useAmazonCognito();

  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname]);

  const getUser = () => {
    setLoading(true);
    refreshToken()
      .then(() => {
        if (NON_LOGIN_ROUTES_KEY.includes(String(pathname))) {
          router.push("/profile");
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  if (loading) return <></>;
  return children;
};

export default Layout;
