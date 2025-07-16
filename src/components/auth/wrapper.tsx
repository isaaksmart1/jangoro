import React, { useEffect, useState } from "react";
import { useNavigation } from "@refinedev/core";
import { authProvider } from "@/providers";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [identity, setIdentity] = useState(null);
  const { push } = useNavigation();

  useEffect(() => {
    getIdentity();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // Comment out below to see billing in free version
    if (!identity && !storedUser) {
      push("/login"); // Redirect to login page
    }
  }, [identity, push]);

  const getIdentity = async () => {
    const user = await authProvider.getIdentity();
    setIdentity(user);
  };

  return <React.Fragment>{children}</React.Fragment>;
};
