import { Draggable } from "react-beautiful-dnd";
import style from "./style.module.css";
import Image from "next/image";

export type DraggableListItemProps = {
  item: string;
  index: number;
  onMouseOver: () => void;
  onClick: () => void;
};

const DraggableListItem = (props: DraggableListItemProps) => {
  // const classes = useStyles();
  return (
    <Draggable draggableId={props.item} index={props.index}>
      {(provided) => (
        <Image
          alt=""
          className={style.image}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={props.item}
          src={props.item}
          width={300}
          height={300}
        />
      )}
    </Draggable>
  );
};

export default DraggableListItem;
