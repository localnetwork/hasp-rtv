import React from "react";
import RTVInput from "./RTVInput";
import RTVMedia from "./RTVMedia";
import RTVRelatedResource from "./RTVRelatedResource";
export default function RTVFormfield({
  section,
  fieldName,
  field,
  setData,
  data,
  handleChange,
}) {
  let renderField;

  switch (field.type) {
    case "text":
      renderField = (
        <RTVInput
          key={fieldName}
          section={section}
          label={field.label || fieldName}
          value={field.value}
          onChange={(e) => handleChange(section, fieldName, e.target.value)}
          setData={setData}
          data={data}
        />
      );
      break;

    case "media":
      renderField = (
        <RTVMedia
          values={field.value}
          label={field.label || fieldName}
          onChange={(newValues) => handleChange(section, fieldName, newValues)}
        />
      );
      break;

    case "related_resource":
      renderField = (
        <RTVRelatedResource
          label={field.label || fieldName}
          options={field.options || {}}
          onChange={
            (newValues) => handleChange(section, fieldName, newValues) // ✅ matches same pattern
          }
          section={section}
          setData={setData}
          data={data}
        />
      );
      break;

    default:
      return null;
  }
  return <div className="mb-4">{renderField}</div>;
}
