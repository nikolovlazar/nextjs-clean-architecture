import { captureException } from "@sentry/nextjs";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/config";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { InputParseError } from "@/src/entities/errors/common";
import { createTodoController } from "@/src/interface-adapters/controllers/todos/create-todo.controller";

export async function PUT(request: Request) {
  const formData = await request.formData();

  try {
    const data = Object.fromEntries(formData.entries());
    const sessionId = cookies().get(SESSION_COOKIE)?.value;
    await createTodoController(data, sessionId);
  } catch (err) {
    if (err instanceof InputParseError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof UnauthenticatedError) {
      return Response.json(
        { error: "Must be logged in to create a todo" },
        { status: 401 },
      );
    }

    captureException(err);
    return Response.json(
      {
        error:
          "An error happened while creating a todo. The developers have been notified. Please try again later.",
      },
      { status: 500 },
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
