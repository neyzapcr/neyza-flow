import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import Button from "../Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi...",
  emptyMessage = "Tidak ada opsi ditemukan.",
  className,
}) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal text-left bg-white text-gray-800 border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#2940D3]/20 transition-all", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden">
        <Command className="w-full">
          <CommandInput placeholder="Cari..." className="border-none focus:ring-0" />
          <CommandList className="max-h-50 overflow-y-auto w-full">
            <CommandEmpty className="py-3 text-center text-xs text-gray-400">{emptyMessage}</CommandEmpty>
            <CommandGroup className="p-1">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onSelect={() => {
                    onChange?.(opt.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 text-[#2940D3]",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
