import React from "react";
import { PropagateLoader } from "react-spinners";

const PageLoader = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <PropagateLoader color="#0ea5e9" size={20} />
    </div>
  );
}

export default PageLoader;