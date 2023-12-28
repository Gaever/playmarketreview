import ReactAvatar, { ReactAvatarProps } from "react-avatar";
import s from "./style.module.css";

function Avatar(props: ReactAvatarProps) {
  return <ReactAvatar {...props} className={`${props.className || ""} ${s.avatar}`} />;
}

export default Avatar;
