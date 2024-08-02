"use client";

import { Plus } from "lucide-react";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import { addTodo } from "./actions";
import { useRef } from "react";

export function AddTodo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    await addTodo(formData);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
      <Input
        ref={inputRef}
        name="todo"
        className="flex-1"
        placeholder="Take out trash"
      />
      <Button size="icon" type="submit">
        <Plus />
      </Button>
    </form>
  );
}
