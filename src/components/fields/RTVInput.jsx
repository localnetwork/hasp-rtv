import React from "react";
import { Input } from "../ui/input";

export default function RTVInput({
  field,
  section,
  label,
  value,
  onChange,
  setData,
  key,
}) {
  const fieldKey = label.toLowerCase().replace(" ", "_");

  console.log("key", key);
  console.log("field", field);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        placeholder="Type here..."
        value={value}
        onChange={(e) => {
          onChange && onChange(e);

          if (setData) {
            setData((prev) => {
              const currentSection = prev[section] || {};
              const prevFields = currentSection.fields || {};

              return {
                ...prev,
                [section]: {
                  ...currentSection,
                  [fieldKey]: e.target.value, // replace old value
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
