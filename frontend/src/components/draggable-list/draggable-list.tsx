import * as React from "react";
import DraggableListItem from "./draggable-list-item";
import { DragDropContext, Droppable, DropResult, OnDragEndResponder } from "react-beautiful-dnd";

export type DraggableListProps = {
  items: string[];
  onDragEnd: OnDragEndResponder;
  onMouseOverItem?: (index: number) => void;
  onItemClick?: (index: number) => void;
};

const reorder: <T>(list: T[], startIndex: number, endIndex: number) => T[] = (
  list,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DraggableList = (props: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <Droppable droppableId="droppable-list" direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {props.items.map((item, index) => (
              <DraggableListItem
                item={item}
                index={index}
                key={item}
                onClick={() => {
                  props.onMouseOverItem?.(index);
                }}
                onMouseOver={() => {
                  props.onItemClick?.(index);
                }}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
