import { categoryToIcon } from "@/lib/services/categories/use-categories";
import { Category } from "@/types";
import React, { useMemo } from "react";
import style from "./menu.module.scss";

export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactElement | null;
}

export interface CategoriesMenuProps {
  categories: Category[];
  pickedCategoriesIds: Category["id"][];
  onClick: (categoryId: Category["id"]) => void;
}

function Row(props: { CategoriesMenuProps: CategoriesMenuProps; MenuItem: MenuItem }) {
  return (
    <div
      key={props.MenuItem.title}
      className={`text-center rounded p-2 px-3 ${style["row-item"]} ${
        props.CategoriesMenuProps.pickedCategoriesIds.includes(props.MenuItem.id) ? style.picked : ""
      } me-2 mb-2`}
      onClick={() => {
        props.CategoriesMenuProps.onClick(props.MenuItem.id);
      }}
    >
      <div className="d-flex gap-2">
        {props.MenuItem.icon}
        <div className={`d-flex align-items-center ${style.title} ${style["category-item"]}`}>
          {props.MenuItem.title}
        </div>
      </div>
    </div>
  );
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = (props) => {
  const menuItems: MenuItem[] = props.categories.map((item) => {
    const icon: MenuItem["icon"] | null = categoryToIcon[item.label?.toLowerCase()] ?? null;

    return {
      id: `${item.id}`,
      icon,
      title: item.label,
    };
  });

  const [row1, row2] = useMemo(() => {
    const row2: typeof menuItems = [];
    const row1: typeof menuItems = [];

    menuItems.forEach((item, index) => {
      if (index % 2 === 0) {
        row1.push(item);
      } else {
        row2.push(item);
      }
    });

    return [row1, row2];
  }, [menuItems]);

  return (
    <div className={`${style.scrollmenu} ps-2`}>
      {row1.map((item) => (
        <Row key={item.id} CategoriesMenuProps={props} MenuItem={item} />
      ))}
      <br />
      {row2.map((item) => (
        <Row key={item.id} CategoriesMenuProps={props} MenuItem={item} />
      ))}
    </div>
  );
};

export default CategoriesMenu;
