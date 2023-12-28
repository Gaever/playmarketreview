"use client";

import Header from "@/components/header/header";

export default function NotFound() {
  return (
    <div className="container h-100 d-flex flex-column pt-3">
      <Header />
      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center fw-semibold fs-4">
        <h2>Not Found</h2>
        <p className="text-center">Could not find requested resource</p>
      </div>
    </div>
  );
}
