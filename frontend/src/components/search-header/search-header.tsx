import { Button, FormControl, FormControlProps, InputGroup, InputGroupText } from "@/ssr-compat/react-bootstrap";
import { MouseEventHandler } from "react";
import { Search as SearchIcon, Sliders2 } from "react-bootstrap-icons";
import styles from "./style.module.css";

export interface SearchHeaderProps {
  onChange: FormControlProps["onChange"];
  onFilterClick: MouseEventHandler<SVGElement>;
  onSearchSubmit: () => void;
}

function SearchHeader(props: SearchHeaderProps) {
  return (
    <header className={styles.header}>
      <form
        className="d-flex justify-content-between align-items-center p-2 w-100"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSearchSubmit();
        }}
      >
        <InputGroup className="flex-1 bg-light rounded-2 me-1">
          <InputGroupText className="border-0 bg-transparent">
            <SearchIcon />
          </InputGroupText>
          <FormControl
            enterKeyHint="search"
            onChange={(event) => {
              props.onChange?.(event);
            }}
            placeholder="Rechercher..."
            className="border-0 bg-transparent"
          />
          {/* {!!value ? (
            <InputGroupText className="border-0 bg-transparent">
              <Button type="submit" size="sm" className="p-0 px-2">
                Find
              </Button>
            </InputGroupText>
          ) : null} */}
        </InputGroup>
        <Button variant="light" className="" data-bs-toggle="modal">
          <Sliders2
            onClick={(e) => {
              props.onFilterClick(e);
            }}
            size={20}
          />
        </Button>
      </form>
    </header>
  );
}

export default SearchHeader;
