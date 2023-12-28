"use client";

import { rnEvents } from "@/lib/rn-events";
import { useEffect, useRef, useState } from "react";

export interface RnAppMountedProps {}

function RnAppMounted(_props: RnAppMountedProps) {
  const ref = useRef(null);
  const [isAppMounted, setIsAppMounted] = useState(false);

  useEffect(() => {
    if (!isAppMounted && ref.current) {
      rnEvents.appMounted();
      setIsAppMounted(true);
    }
    // eslint-disable-next-line
  }, [isAppMounted, ref.current]);

  return <div ref={ref} />;
}

export default RnAppMounted;
