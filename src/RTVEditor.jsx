import React, { useRef, useState } from "react";
import "./styles.css";

export default function RTVEditor({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  className = "",
}) {
  return <div className={`rtv-editor ${className}`}>Hello World</div>;
}
