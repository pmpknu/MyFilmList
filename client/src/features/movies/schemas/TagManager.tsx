import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XIcon } from "lucide-react"; // Icon for removing tags, adjust based on your icon library

interface TagManagerProps {
  initialItems: string[];
  onItemsChange?: (items: string[]) => void;
  label?: string;
}

export const TagManager: React.FC<TagManagerProps> = ({
  initialItems,
  onItemsChange,
  label,
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !items.includes(inputValue)) {
      const newItems = [...items, inputValue];
      setItems(newItems);
      setInputValue("");
      onItemsChange?.(newItems);
    }
  };

  const handleRemove = (itemToRemove: string) => {
    const newItems = items.filter((item) => item !== itemToRemove);
    setItems(newItems);
    onItemsChange?.(newItems);
  };

  return (
    <div className="flex flex-col gap-4">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Add ${label?.toLocaleLowerCase()}`}
          className="flex-grow"
        />
        <Button onClick={handleAdd} type="button">
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge
            key={index}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg bg-muted text-muted-foreground"
          >
            {item}
            <button
              onClick={() => handleRemove(item)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label={`Remove ${item}`}
            >
              <XIcon size={16} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
