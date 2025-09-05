import React from "react";
import { Button } from "./components/ui/button";
import "./styles.css";

import { getConfig } from "./config/env";

export default function RTVEditor({ children, data }) {
  const variables = getConfig();

  return (
    <div className="p-4 hover:border hover:border-dashed rounded">
      {children}
    </div>
  );
}
