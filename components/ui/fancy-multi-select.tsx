/**
 * see:
 * - https://craft.mxkaske.dev/post/fancy-multi-select
 * - https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx
 *
 */

'use client';

import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { SetStateAction, useCallback, useRef, useState } from 'react';

type Props = {
  selectedOptions: string[];
  onSelectedOptionsChange: (value: SetStateAction<string[]>) => void;
  options: string[];
  emptyMessage?: string;
  placeholder?: string;
};

export function FancyMultiSelect({
  selectedOptions,
  onSelectedOptionsChange,
  options,
  emptyMessage,
  placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputValueChange = (inputValue: string) => {
    if (!open) {
      setOpen(true);
    }
    setInputValue(inputValue);
  };

  const handleUnselect = useCallback((option: string) => {
    onSelectedOptionsChange((prev) => prev.filter((s) => s !== option));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          onSelectedOptionsChange((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter((option) => !selectedOptions.includes(option));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => {
            return (
              <Badge key={option} variant="secondary">
                {option}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={handleInputValueChange}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-96 overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setOpen(false);
                        setInputValue('');
                        onSelectedOptionsChange((prev) => [...prev, option]);
                      }}
                      className={'cursor-pointer'}
                    >
                      {option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
