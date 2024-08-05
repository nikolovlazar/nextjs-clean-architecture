import { validateRequest } from "@/lucia";
import { Separator } from "./_components/ui/separator";
import { AddTodo } from "./add-todo";
import { Todos } from "./todos";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./_components/ui/card";
import { UserMenu } from "./_components/ui/user-menu";
import { todos as todosSchema } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/sign-in");
  }

  const todos = await db.query.todos.findMany({
    where: eq(todosSchema.userId, user.id),
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">TODOs</CardTitle>
        <UserMenu />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <AddTodo />
        <Todos todos={todos} />
      </CardContent>
    </Card>
  );
}
