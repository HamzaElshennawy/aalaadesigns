// app/layout.tsx
"use client";
import { useState, useEffect } from "react";

import LogoAnimated from "@/components/logo_animated";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace setTimeout with actual loading check
    const handleComplete = () => {
      if (document.readyState === "complete") {
        setLoading(false);
      }
    };

    handleComplete(); // Check immediately
    window.addEventListener("load", handleComplete);

    return () => window.removeEventListener("load", handleComplete);
  }, []);

  return loading ? <LogoAnimated /> : <>{children}</>;
};

export default AppWrapper;
