import React from "react";

export function lb(string: string): JSX.Element[] {
  return string.split("\n").map((text, index) => (
    <React.Fragment key={`${text}${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));
}
