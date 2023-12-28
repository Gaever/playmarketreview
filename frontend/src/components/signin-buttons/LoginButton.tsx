"use client";

import Spinner from "react-bootstrap/Spinner";

export interface LoginButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

function LoginButton(props: LoginButtonProps) {
  return (
    <button type="submit" className="btn btn-primary btn-block w-100" disabled={props.isLoading || props.disabled}>
      Continue
      {props.isLoading ? (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
      ) : null}
    </button>
  );
}

export default LoginButton;
