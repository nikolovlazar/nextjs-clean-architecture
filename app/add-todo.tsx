"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";

export function CreateTodo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/todos", { method: "PUT", body: formData });

    if (res.ok) {
      toast.success("Todo created!");
      router.refresh();
    } else {
      const { error } = await res.json();
      toast.error(error);
      if (res.status === 401) {
        router.push("/sign-in");
      }
    }

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
