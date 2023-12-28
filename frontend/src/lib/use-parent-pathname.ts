"use client";

import { usePathname } from "next/navigation";

export function useParentPathname() {
  const pathname = usePathname();

  const pathnameArr = pathname.split("/");
  const parentPathname = pathname === "/" ? "/" : pathnameArr.splice(0, pathnameArr.length - 1).join("/");

  return { parentPathname };
}
