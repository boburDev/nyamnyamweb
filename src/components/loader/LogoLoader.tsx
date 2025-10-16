"use client";

import { LogoIcon } from "@/assets/icons";
import React, { useEffect, useState } from "react";
import styles from "./loading.module.css";

const LogoLoader = () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (hide) return null;

  return (
    <div className={styles.logoOverlay}>
      <div className="logoContent">
        <LogoIcon className="logoIcon" />
      </div>
    </div>
  );
};

export default LogoLoader;
