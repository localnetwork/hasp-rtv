import React, { useEffect } from "react";
import globalStore from "@/src/lib/store/globalStore";
import BLOCKAPI from "@/src/api/block/request";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { X } from "lucide-react";

export default function RTVBlockEditor({
  children,
  entity,
  id,
  slug,
  data,
  setData,
}) {
  const isEditorOpen = globalStore((state) => state.isEditorOpen);
  const [schema, setSchema] = React.useState(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await BLOCKAPI.getBlockSchemaById(id);
        setSchema(response.attributes.data_schema);
      } catch (error) {
        console.error("Error fetching schema:", error);
      }
    };
    fetchSchema();
  }, [id]);

  // Handle field change
  const handleChange = (section, field, value) => {
    setSchema((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          value,
        },
      },
    }));
  };

  // Render fields by type
  const renderField = (section, fieldName, field) => {
    switch (field.type) {
      case "text":
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {fieldName}
            </label>
            <input
              type="text"
              className="w-full rounded-md border p-2"
              value={field.value || ""}
              onChange={(e) => handleChange(section, fieldName, e.target.value)}
            />
          </div>
        );

      case "media":
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {fieldName}
            </label>
            {field.value?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={fieldName}
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            ))}
          </div>
        );

      case "related_resource":
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {fieldName}
            </label>
            <select
              className="w-full rounded-md border p-2"
              value={field.value}
              onChange={(e) => handleChange(section, fieldName, e.target.value)}
            >
              {Object.entries(field.options || {}).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {children}

      <Sheet open={isEditorOpen} onOpenChange={() => {}}>
        <SheetContent className="!z-[1000] overflow-y-auto">
          {/* Close Button */}
          <X
            className="h-5 w-5 cursor-pointer"
            onClick={() => globalStore.setState({ isEditorOpen: false })}
          />

          <SheetHeader>
            <SheetTitle>Block Editor</SheetTitle>
            <SheetDescription>Edit your block content below.</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            {schema &&
              Object.entries(schema).map(([section, fields]) => (
                <div key={section}>
                  <h3 className="font-semibold text-lg mb-2">{section}</h3>
                  {Object.entries(fields).map(([fieldName, field]) =>
                    renderField(section, fieldName, field)
                  )}
                </div>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
