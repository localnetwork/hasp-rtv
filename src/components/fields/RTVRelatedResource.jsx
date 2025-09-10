"use client";
import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
} from "@/src/components/ui/command";
import { Badge } from "@/src/components/ui/badge";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableBadge({ id, children, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Badge
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      variant="secondary"
      className="flex items-center gap-1 cursor-move"
    >
      {children}
      <span
        className="inline-block"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(id);
        }}
      >
        <X className="h-3 w-3 cursor-pointer ignore-popover-close block" />
      </span>
    </Badge>
  );
}

export default function RTVRelatedResource({
  section,
  label,
  value = [],
  onChange,
  options = {},
  setData,
}) {
  const [open, setOpen] = React.useState(false);

  const [newValues, setNewValues] = React.useState(
    (value || []).map((v) => String(v))
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const fieldKey = label.toLowerCase().replace(" ", "_");

  console.log("fieldKey", section, fieldKey);

  // toggle selection
  const handleToggle = (key) => {
    const strKey = String(key);

    setNewValues((prev) => {
      let updated;
      if (prev.includes(strKey)) {
        updated = prev.filter((v) => v !== strKey);
      } else {
        updated = [...prev, strKey];
      }

      if (setData) {
        setData((prevData) => {
          const currentSection = prevData[section] || {};

          return {
            ...prevData,
            [section]: {
              ...currentSection,
              [fieldKey]: updated,
            },
          };
        });
      }

      onChange(updated);
      return updated;
    });
  };

  // remove item
  const handleRemove = (key) => {
    setNewValues((prev) => {
      const updated = prev.filter((v) => v !== key);

      if (setData) {
        setData((prevData) => {
          const currentSection = prevData[section] || {};
          return {
            ...prevData,
            [section]: {
              ...currentSection,
              [fieldKey]: updated,
            },
          };
        });
      }

      onChange(updated);
      return updated;
    });
  };

  // handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setNewValues((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const updated = arrayMove(prev, oldIndex, newIndex);

        if (setData) {
          setData((prevData) => {
            const currentSection = prevData[section] || {};
            return {
              ...prevData,
              [section]: {
                ...currentSection,
                [fieldKey]: updated,
              },
            };
          });
        }

        onChange(updated);
        return updated;
      });
    }
  };

  return (
    <div className="mb-4 rtv-editor">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <Popover
        open={open}
        onOpenChange={setOpen}
        className="rtv-editor poppins"
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="!w-full !justify-between !h-auto !bg-white"
          >
            {newValues.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={newValues}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex flex-wrap gap-1 max-w-[90%]">
                    {newValues.map((v) => (
                      <SortableBadge key={v} id={v} onRemove={handleRemove}>
                        {options[v] ?? v}
                      </SortableBadge>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              "Select options..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 z-[10000]"
          align="start"
          side="bottom"
          onInteractOutside={(e) => {
            if (e.target.closest(".ignore-popover-close")) {
              e.preventDefault();
            }
          }}
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {Object.entries(options).map(([key, optionLabel]) => {
                  const selected = newValues.includes(String(key));
                  return (
                    <CommandItem
                      key={key}
                      value={optionLabel}
                      onSelect={() => handleToggle(key)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {optionLabel}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
