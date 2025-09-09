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

export default function RTVRelatedResource({
  section, // ✅ which section in schema
  label,
  value = [], // array of selected keys
  onChange,
  options = {},
  setData,
}) {
  const [open, setOpen] = React.useState(false);

  // local state array (normalized to string IDs)
  const [newValues, setNewValues] = React.useState(
    (value || []).map((v) => String(v))
  );

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
              [label.toLowerCase()]: updated, // ✅ store updated array
            },
          };
        });
      }

      onChange(updated); // still emit array of keys
      return updated;
    });
  };

  // remove by badge click
  const handleRemove = (key) => {
    console.log("handle remove!!!");
    setNewValues((prev) => {
      const updated = prev.filter((v) => String(v) !== String(key));

      if (setData) {
        setData((prevData) => {
          const currentSection = prevData[section] || {};
          return {
            ...prevData,
            [section]: {
              ...currentSection,
              [label.toLowerCase()]: updated,
            },
          };
        });
      }

      onChange(updated);
      return updated;
    });
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
            className="!w-full !justify-between !h-auto !hover:bg-white"
          >
            {newValues.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-[90%]">
                {newValues.map((v) => (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {options[v] ?? v}
                    <span
                      className="inline-block "
                      onClick={(e) => {
                        e.preventDefault(); // ✅ keep popover open
                        e.stopPropagation();
                        handleRemove(v);
                      }}
                    >
                      <X className="h-3 w-3 cursor-pointer ignore-popover-close block" />
                    </span>
                  </Badge>
                ))}
              </div>
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
                      value={optionLabel} // ✅ searchable by label
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
