import React from "react";
import { Input, Button, Chip } from "@nextui-org/react";

interface TagManagerProps<T> {
  initialItems: T[];
  onItemsChange?: (items: T[]) => void;
  renderItem?: (item: T) => React.ReactNode;
  label?: string;
}

export const TagManager = <T extends string | number>({
  initialItems,
  onItemsChange,
  renderItem,
  label
}: TagManagerProps<T>) => {
  const [items, setItems] = React.useState<T[]>(initialItems);
  const [inputValue, setInputValue] = React.useState("");

  const handleAdd = () => {
    if (inputValue.trim() && !items.includes(inputValue as T)) {
      const newItems = [...items, inputValue as T];
      setItems(newItems);
      setInputValue("");
      onItemsChange?.(newItems);
    }
  };

  const handleRemove = (itemToRemove: T) => {
    const newItems = items.filter((item) => item !== itemToRemove);
    setItems(newItems);
    onItemsChange?.(newItems);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          label={label}
          isClearable
          placeholder="Add an item"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {items.map((item, index) => (
          <Chip key={index} variant="flat" onClose={() => handleRemove(item)}>
            {renderItem ? renderItem(item) : item}
          </Chip>
        ))}
      </div>
    </div>
  );
};
