import React from "react";
import { Input } from "../ui/input";

export default function RTVInput({
  section, // 👈 add section
  label,
  value,
  onChange,
  setData,
  data,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        placeholder="Type here..."
        value={value}
        onChange={(e) => {
          onChange(e);

          if (setData) {
            setData((prev) => {
              const currentSection = prev[section] || {};
              return {
                ...prev,
                [section]: {
                  ...currentSection,
                  [label.toLowerCase()]: e.target.value,
                },
              };
            });
          }
        }}
        className="!bg-white"
      />
    </div>
  );
}
