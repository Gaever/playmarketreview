"use client";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export interface SignUpButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

function SignUpButton(props: SignUpButtonProps) {
  return (
    <Button type="submit" className="btn btn-primary btn-block w-100" disabled={props.isLoading || props.disabled}>
      Sign Up
      {props.isLoading ? (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
      ) : null}
    </Button>
  );
}

export default SignUpButton;
