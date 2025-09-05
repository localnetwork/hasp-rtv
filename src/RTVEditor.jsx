import React from "react";
import { Button } from "./components/ui/button";
import "./styles.css";
export default function RTVEditor() {
  return (
    <div className="p-4 border rounded">
      <textarea
        className="w-full p-2 border rounded mb-2 h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type here..."
      />
      <span className="bg-[#b56227] text-white px-2 py-1 rounded text-sm">
        0/500
      </span>
      <Button variant="default" size="default" className="mt-[320px]">
        Save
      </Button>
    </div>
  );
}
