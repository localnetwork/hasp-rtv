import React, { useState, lazy, Suspense } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import "./styles.css";
import globalStore from "./lib/store/globalStore";

// Dynamic imports
const RTVBlockEditor = lazy(() => import("./components/entity/RTVBlockEditor"));
const RTVContentEditor = lazy(() =>
  import("./components/entity/RTVContentEditor")
);

export default function RTVEditor({
  children,
  entity,
  id,
  data,
  setData,
  slug,
  name,
}) {
  const [count, setCount] = useState(0);
  const isEditorOpen = globalStore((state) => state.isEditorOpen);

  let form = null;
  switch (entity) {
    case "block":
      form = (
        <RTVBlockEditor
          entity={entity}
          id={id}
          slug={slug}
          data={data}
          setData={setData}
          name={name}
        >
          {children}
        </RTVBlockEditor>
      );
      break;
    case "content":
      form = (
        <RTVContentEditor
          entity={entity}
          id={id}
          slug={slug}
          data={data}
          setData={setData}
          name={name}
        >
          {children}
        </RTVContentEditor>
      );
      break;
    default:
      break;
  }

  return (
    <div className="p-4 rtv-editor group/outer hover:outline-[#ccc] hover:outline-dashed rounded relative">
      <Suspense fallback={<div>Loading editor...</div>}>{form}</Suspense>

      <button
        className="cursor-pointer group/inner group-hover/outer:opacity-100 z-[100] hover:opacity-70 rtv-pencil bg-[#000] group-hover/inner:opacity-60 text-white py-2 gap-x-2 px-5 hidden group-hover/outer:inline-flex items-center ml-2 mb-1 absolute top-0 right-3"
        onClick={() => {
          globalStore.setState({ isEditorOpen: !isEditorOpen });
          globalStore.setState({
            editorInfo: { entity, id, slug, data, setData },
          });
        }}
      >
        <PencilIcon className="w-4 h-4" />
        <span className="group-hover/inner:block hidden">
          Edit this {entity}
        </span>
      </button>
    </div>
  );
}
