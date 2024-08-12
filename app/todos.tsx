"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import { Checkbox } from "./_components/ui/checkbox";
import { cn } from "./_components/utils";

export function Todos({
  todos,
}: {
  todos: { id: number; todo: string; userId: string; completed: boolean }[];
}) {
  const router = useRouter();

  const handleToggle = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/todos/${id}`, { method: "POST" });
      if (res.ok) {
        toast.success("Todo toggled!");
        router.refresh();
      } else {
        const { error } = await res.json();
        toast.error(error);
        if (res.status === 401) {
          router.push("/sign-in");
        }
      }
    },
    [router],
  );

  return (
    <ul className="w-full">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 w-full hover:bg-muted/50 active:bg-muted rounded-sm p-1"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggle(todo.id)}
              id={`checkbox-${todo.id}`}
            />
            <label
              htmlFor={`checkbox-${todo.id}`}
              className={cn("flex-1 cursor-pointer", {
                "text-muted-foreground line-through": todo.completed,
              })}
            >
              {todo.todo}
            </label>
          </li>
        ))
      ) : (
        <p>No todos. Create some to get started!</p>
      )}
    </ul>
  );
}
