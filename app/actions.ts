"use server";

import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/config";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@/src/entities/errors/common";
import { createTodoController } from "@/src/interface-adapters/controllers/todos/create-todo.controller";
import { toggleTodoController } from "@/src/interface-adapters/controllers/todos/toggle-todo.controller";
import { bulkUpdateController } from "@/src/interface-adapters/controllers/todos/bulk-update.controller";

export async function createTodo(formData: FormData) {
  return await withServerActionInstrumentation(
    "createTodo",
    { recordResponse: true },
    async () => {
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
        captureException(err);
        return {
          error:
            "An error happened while creating a todo. The developers have been notified. Please try again later.",
        };
      }

      revalidatePath("/");
      return { success: true };
    },
  );
}

export async function toggleTodo(todoId: number) {
  return await withServerActionInstrumentation(
    "toggleTodo",
    { recordResponse: true },
    async () => {
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
        captureException(err);
        return {
          error:
            "An error happened while toggling the todo. The developers have been notified. Please try again later.",
        };
      }

      revalidatePath("/");
      return { success: true };
    },
  );
}

export async function bulkUpdate(dirty: number[], deleted: number[]) {
  return await withServerActionInstrumentation(
    "bulkUpdate",
    { recordResponse: true },
    async () => {
      try {
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        await bulkUpdateController({ dirty, deleted }, sessionId);
      } catch (err) {
        revalidatePath("/");
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: "Must be logged in to bulk update todos" };
        }
        if (err instanceof NotFoundError) {
          return { error: "Todo does not exist" };
        }
        captureException(err);
        return {
          error:
            "An error happened while bulk updating the todos. The developers have been notified. Please try again later.",
        };
      }

      revalidatePath("/");
      return { success: true };
    },
  );
}
