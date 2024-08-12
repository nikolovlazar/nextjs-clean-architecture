import { captureException } from "@sentry/nextjs";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/config";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@/src/entities/errors/common";
import { toggleTodoController } from "@/src/interface-adapters/controllers/todos/toggle-todo.controller";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  try {
    const sessionId = cookies().get(SESSION_COOKIE)?.value;
    await toggleTodoController({ todoId: id }, sessionId);
  } catch (err) {
    if (err instanceof InputParseError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof UnauthenticatedError) {
      return Response.json(
        { error: "Must be logged in to create a todo" },
        { status: 403 },
      );
    }
    if (err instanceof NotFoundError) {
      return Response.json({ error: "Todo does not exist" }, { status: 404 });
    }

    captureException(err);
    return Response.json(
      {
        error:
          "An error happened while toggling the todo. The developers have been notified. Please try again later.",
      },
      { status: 500 },
    );
  }

  return Response.json({ success: true }, { status: 200 });
}
