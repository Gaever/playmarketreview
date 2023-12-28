import Header from "@/components/header/header";
import style from "./page.module.css";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <div className={style.layout}>
      <Header />
      {props.children}
    </div>
  );
}
