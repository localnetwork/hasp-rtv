import React, { useEffect, useMemo, lazy, Suspense } from "react";
import globalStore from "@/src/lib/store/globalStore";
import BLOCKAPI from "@/src/api/block/request";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { AngryIcon, RefreshCcw } from "lucide-react";

// Dynamic import of RTVFormfield
const RTVFormfield = lazy(() => import("../fields/RTVFormfield"));

export default function RTVBlockEditor({
  children,
  entity,
  id,
  slug,
  data,
  name,
  setData,
}) {
  const isEditorOpen = globalStore((state) => state.isEditorOpen);
  const actualSchema = globalStore((state) => state.actualSchema);
  const temporarySchema = globalStore((state) => state.temporarySchema);

  const [isLoading, setIsLoading] = React.useState(false);

  // Load schema only if not already in temporarySchema
  useEffect(() => {
    if (isEditorOpen && id && !temporarySchema) {
      const fetchSchema = async () => {
        setIsLoading(true);
        try {
          const res = await BLOCKAPI.getBlockSchemaById(id);
          const blockSchema = res?.attributes?.data_schema || {};

          globalStore.setState({
            actualSchema: blockSchema,
            temporarySchema: JSON.parse(JSON.stringify(blockSchema)),
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching block schema:", error);
        }
      };
      fetchSchema();
    }
  }, [id, isEditorOpen, temporarySchema]);

  const isDirty = useMemo(() => {
    if (!actualSchema || !temporarySchema) return false;
    return JSON.stringify(temporarySchema) !== JSON.stringify(actualSchema);
  }, [temporarySchema, actualSchema]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleChange = (section, field, value) => {
    globalStore.setState((state) => {
      const prevSection = state.temporarySchema?.[section] || {};
      const prevFields = prevSection.fields || {};
      const prevField = prevFields[field] || {};

      return {
        temporarySchema: {
          ...state.temporarySchema,
          [section]: {
            ...prevSection,
            fields: {
              ...prevFields,
              [field]: {
                ...prevField,
                value: Array.isArray(value) ? [...value] : value,
              },
            },
          },
        },
      };
    });
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (!confirmLeave) return;
    }
    globalStore.setState({
      isEditorOpen: false,
      temporarySchema: actualSchema,
    });
  };

  const handleSave = () => {
    if (setData) setData(temporarySchema);
    globalStore.setState({
      actualSchema: temporarySchema,
      isEditorOpen: false,
    });
  };

  return (
    <div>
      {children}

      <Sheet
        open={isEditorOpen}
        onOpenChange={(open) => globalStore.setState({ isEditorOpen: open })}
      >
        <SheetContent className="overflow-y-auto flex flex-col rtv-sheet min-w-[500px]">
          <SheetHeader>
            <SheetTitle>Editing {name} block</SheetTitle>
          </SheetHeader>

          <div className="mt-4 px-4 space-y-6 flex-1">
            {isLoading && <p>Loading schema...</p>}
            {!isLoading && !temporarySchema && (
              <div className="flex flex-col gap-2 min-h-[450px] text-black items-center justify-center text-center">
                <AngryIcon className="inline-block mr-2 w-[50px] h-[50px]" />
                Unable to load schema. Please refresh the page and try again.
                <div className="mt-4">
                  <RefreshCcw
                    onClick={() => window.location.reload()}
                    className="inline-block ml-2 w-[50px] h-[50px] cursor-pointer hover:opacity-70"
                  />
                </div>
              </div>
            )}

            {!isLoading && temporarySchema && (
              <Suspense fallback={<div>Loading form fields...</div>}>
                {Object.entries(temporarySchema).map(
                  ([sectionKey, sectionData]) => (
                    <div
                      key={sectionKey}
                      className="bg-[#f5f5f5] p-4 rounded-md"
                    >
                      <h3 className="bg-black inline-block text-[10px] px-[12px] py-[1px] relative top-[-15px] text-[#f5f5f5] rounded-[0_12px]">
                        {sectionData.title || sectionKey}
                      </h3>
                      {Object.entries(sectionData.fields || {}).map(
                        ([fieldName, field]) => (
                          <RTVFormfield
                            section={sectionKey}
                            fieldName={fieldName}
                            field={field}
                            onChange={handleChange}
                            handleChange={handleChange}
                            key={fieldName}
                            data={data}
                            setData={setData}
                          />
                        )
                      )}
                    </div>
                  )
                )}
              </Suspense>
            )}
          </div>

          {!isLoading && temporarySchema && (
            <div className="mt-6 flex gap-2 px-4 border-t py-4 sticky bottom-0 bg-white">
              <Button className="w-1/2" onClick={handleSave}>
                Save
              </Button>
              <Button
                className="w-1/2"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
