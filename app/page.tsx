import { Avatar, AvatarFallback, AvatarImage } from "./_components/ui/avatar";
import { Button } from "./_components/ui/button";
import { Separator } from "./_components/ui/separator";
import { AddTodo } from "./add-todo";
import { Todos } from "./todos";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-start justify-between p-8 bg-card rounded-md shadow-md w-full max-w-lg">
      <div className="flex gap-4 items-center w-full">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>LN</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold flex-1">Welcome, user</h2>
        <Button variant="link">Sign out</Button>
      </div>
      <Separator />
      <h2 className="text-lg font-bold">TODOs:</h2>
      <AddTodo />
      <Todos />
    </main>
  );
}
