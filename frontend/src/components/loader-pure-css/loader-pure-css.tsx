import React from "react";
import style from "./style.module.css";

export interface LoaderPureCssProps {}

function LoaderPureCss(_props: LoaderPureCssProps) {
	return (
		<div className={style["lds-ring"]}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export default LoaderPureCss;
