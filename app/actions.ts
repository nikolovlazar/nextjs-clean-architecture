"use server";

import { SESSION_COOKIE } from "@/config";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@/src/entities/errors/common";
import { createTodoController } from "@/src/interface-adapters/controllers/todos/create-todo.controller";
import { toggleTodoController } from "@/src/interface-adapters/controllers/todos/toggle-todo.controller";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTodo(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const sessionId = cookies().get(SESSION_COOKIE)?.value;
    await createTodoController(data, sessionId);
  } catch (err) {
    if (err instanceof InputParseError) {
      return { error: err.message };
    }
    if (err instanceof UnauthenticatedError) {
      return { error: "Must be logged in to create a todo" };
    }
    // TODO: report "err" to Sentry
    return {
      error:
        "An error happened while creating a todo. The developers have been notified. Please try again later.",
    };
  }

  revalidatePath("/");
  return { success: true };
}

export async function toggleTodo(todoId: number) {
  try {
    const sessionId = cookies().get(SESSION_COOKIE)?.value;
    await toggleTodoController({ todoId }, sessionId);
  } catch (err) {
    if (err instanceof InputParseError) {
      return { error: err.message };
    }
    if (err instanceof UnauthenticatedError) {
      return { error: "Must be logged in to create a todo" };
    }
    if (err instanceof NotFoundError) {
      return { error: "Todo does not exist" };
    }
    // TODO: report "err" to Sentry
    return {
      error:
        "An error happened while toggling the todo. The developers have been notified. Please try again later.",
    };
  }

  revalidatePath("/");
  return { success: true };
}
