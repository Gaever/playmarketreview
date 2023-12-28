"use client";

import { useParentPathname } from "@/lib/use-parent-pathname";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "react-bootstrap-icons";
import style from "./style.module.css";

export interface HeaderProps {
  showBack?: boolean;
  backBehaviour?: "tree" | "stack";
  rightButtons?: React.ReactElement;
  title?: string;
  titleHref?: string;
  onBackClick?: () => void;
}

function Header(props: HeaderProps) {
  const { back } = useRouter();
  const { parentPathname } = useParentPathname();
  const backBehaviour = props.backBehaviour ?? "stack";

  return (
    <header className={style.container}>
      <div className="flex-1">
        {props.showBack ?? true ? (
          <>
            {!props.onBackClick && backBehaviour === "stack" ? <ChevronLeft onClick={back} size={24} /> : null}
            {!props.onBackClick && backBehaviour === "tree" ? (
              <Link href={parentPathname}>
                <ChevronLeft size={24} />
              </Link>
            ) : null}
            {props.onBackClick ? <ChevronLeft onClick={props.onBackClick} size={24} /> : null}
          </>
        ) : null}
      </div>
      <div className="flex-1 fw-semibold">
        {props.titleHref ? <Link href={props.titleHref}>{props.title}</Link> : props.title}
      </div>

      <div className="flex-1 d-flex align-items-end">{props.rightButtons}</div>
    </header>
  );
}

export default Header;
