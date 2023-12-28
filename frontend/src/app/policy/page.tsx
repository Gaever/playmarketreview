import LoaderPureCss from "@/components/loader-pure-css/loader-pure-css";
import style from "./page.module.css";
import Header from "@/components/header/header";

function Policy() {
  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style["loader"]}>
        <LoaderPureCss />
      </div>
      <iframe className={style["iframe"]} src={process.env.NEXT_PUBLIC_POLICY_EMBED_URL}></iframe>
    </div>
  );
}

export default Policy;
