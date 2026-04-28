"use client";

import ClipLoader from "react-spinners/ClipLoader";

function Spinner() {
  return (
    <ClipLoader
      color="#3b82f6"
      loading={true}
      cssOverride={{
        display: "block",
        margin: "100px auto",
      }}
      size={150}
      aria-label="Loading Spinner"
    />
  );
}

export default Spinner;
