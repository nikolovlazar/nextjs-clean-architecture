"use server";

import { db } from "@/drizzle";
import { todos } from "@/drizzle/schema";
import { validateRequest } from "@/lucia";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function addTodo(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Must be logged in to create todos.");
  }

  const todoValue = formData.get("todo")?.toString();

  if (!todoValue) {
    throw new Error('"todo" value is required');
  }

  await db
    .insert(todos)
    .values({ todo: todoValue, userId: user.id, completed: false });

  revalidatePath("/");
}

export async function toggleTodo(todoId: number) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Must be logged in to toggle todos.");
  }

  const existingTodo = await db.query.todos.findFirst({
    where: eq(todos.id, todoId),
  });

  if (!existingTodo) {
    notFound();
  }

  if (existingTodo.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(todos)
    .set({ ...existingTodo, completed: !existingTodo.completed })
    .where(eq(todos.id, todoId));

  revalidatePath("/");
}
