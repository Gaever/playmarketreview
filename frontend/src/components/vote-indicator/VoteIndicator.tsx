import { HandThumbsDown, HandThumbsUp } from "react-bootstrap-icons";
import style from "./styles.module.scss";
import colors from "@/lib/theme/colors.module.scss";

export interface VoteIndicatorProps {
  upVotes: number;
  downVotes: number;
}

function VoteIndicator(props: VoteIndicatorProps) {
  return (
    <div className="d-flex gap-2 align-items-center">
      <div className="d-flex gap-1 align-items-center justify-content-center">
        <HandThumbsUp color={colors.success} />
        <span className={`${style.text} ${style["text-good"]}`}>{props.upVotes}</span>
      </div>
      <div className="d-flex gap-1 align-items-center justify-content-center">
        <HandThumbsDown color={colors.danger} />
        <span className={`${style.text} ${style["text-bad"]}`}>{props.downVotes}</span>
      </div>
    </div>
  );
}

export default VoteIndicator;
