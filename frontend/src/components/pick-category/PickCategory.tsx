"use client";
import { categoryToIcon } from "@/lib/services/categories/use-categories";
import { Category } from "@/types";
import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

export interface PickCategoryProps {
  categories: Category[] | undefined;
  onCategoryPicked: (category: Category) => void;
}

function PickCategory(props: PickCategoryProps) {
  return (
    <ListGroup>
      {(props.categories || []).map((item) => (
        <ListGroup.Item
          key={item.id}
          action
          onClick={() => {
            props.onCategoryPicked(item);
          }}
          className="d-flex gap-3 align-items-center"
        >
          {categoryToIcon[item.label?.toLowerCase?.()]}
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default PickCategory;
