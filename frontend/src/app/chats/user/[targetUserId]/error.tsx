"use client";

import Header from "@/components/header/header";
import { XCircle } from "react-bootstrap-icons";

function Error(props: { error: string }) {
  console.error(props.error);

  return (
    <div className="container h-100 d-flex flex-column pt-3">
      <Header />
      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center fw-semibold fs-4">
        <XCircle size="40px" className="mb-2" />
        Failed to start chat room.
      </div>
    </div>
  );
}

export default Error;
