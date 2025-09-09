"use client";
import React from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "@/src/components/ui/dropzone";
import { CloudUploadIcon } from "lucide-react";
import MEDIAAPI from "@/src/api/media/request";

export default function RTVMedia({ onChange, values = [], label, blockId }) {
  const dropzone = useDropzone({
    onDropFile: async (file) => {
      // Generate unique id for this file
      const tempId = Date.now() + "-" + file.name;

      // Convert to base64 for preview
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const preview = await toBase64(file);

      // ✅ 1. Add preview to schema with tempId
      onChange([...(values || []), { id: tempId, preview }]);

      try {
        // ✅ 2. Upload file
        const uploaded = await MEDIAAPI.createMedia({
          content: "media",
          title: file.name,
          status: "1",
          locale: "en",
          data: { media: { media: [preview] } },
        });

        // Suppose API returns uploaded.data.attributes.url
        const url = uploaded?.data?.attributes?.url || null;

        if (url) {
          // ✅ 3. Replace preview entry with real URL
          onChange(
            (values || []).map((item) =>
              item.id === tempId ? { ...item, url, preview: undefined } : item
            )
          );
        }

        return { status: "success", result: preview };
      } catch (err) {
        console.error("Upload failed", err);
        // Optionally mark as failed
        onChange(
          (values || []).map((item) =>
            item.id === tempId ? { ...item, error: true } : item
          )
        );
        return { status: "error", result: preview };
      }
    },
    validation: {
      accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 5,
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <Dropzone {...dropzone}>
        <DropZoneArea className="!p-0">
          <DropzoneTrigger className="flex flex-col items-center gap-4 p-10 text-center !w-full">
            <CloudUploadIcon className="size-8" />
            <p className="font-semibold">Upload images</p>
            <p className="text-sm text-muted-foreground">
              Click here or drag and drop to upload
            </p>
          </DropzoneTrigger>
        </DropZoneArea>
        {/* Render schema values (URLs or previews) */}
        {values?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {values.map((val, i) => (
              <div
                key={val.id || i}
                className="overflow-hidden rounded-md bg-secondary shadow-sm"
              >
                <img
                  src={val}
                  alt={`${label}-${i}`}
                  className="aspect-video object-contain bg-black"
                />
                {val.error && (
                  <p className="text-xs text-red-500 text-center p-1">
                    Upload failed
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
