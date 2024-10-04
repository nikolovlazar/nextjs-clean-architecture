import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { captureException, startSpan } from "@sentry/nextjs";

import { SESSION_COOKIE } from "@/config";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "@/src/entities/errors/auth";
import { Todo } from "@/src/entities/models/todo";
import { getTodosForUserController } from "@/src/interface-adapters/controllers/todos/get-todos-for-user.controller";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./_components/ui/card";
import { Separator } from "./_components/ui/separator";
import { UserMenu } from "./_components/ui/user-menu";
import { CreateTodo } from "./add-todo";
import { Todos } from "./todos";

async function getTodos(page: number, sessionId: string | undefined) {
  return await startSpan(
    {
      name: "getTodos",
      op: "function.nextjs",
    },
    async () => {
      try {
        return await getTodosForUserController(page, sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect("/sign-in");
        }
        captureException(err);
        throw err;
      }
    },
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  let todos: Todo[];
  let pages: number = 1;
  try {
    const res = await getTodos(page, sessionId);
    todos = res.todos;
    pages = res.pages;
  } catch (err) {
    throw err;
  }

  if (page > pages) {
    redirect(`?page=${pages}`);
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">TODOs</CardTitle>
        <UserMenu />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <CreateTodo />
        <Todos todos={todos} pages={pages} page={page} />
      </CardContent>
    </Card>
  );
}
