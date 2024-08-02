import { Checkbox } from "./_components/ui/checkbox";

export function Todos() {
  const todos = ["Take out trash", "Record YouTube tutorial", "Meet with Matt"];

  return (
    <ul className="w-full">
      {todos.map((todo) => (
        <li
          key={todo}
          className="flex items-center gap-2 w-full hover:bg-muted/50 active:bg-muted rounded-sm p-1"
        >
          <Checkbox id={`checkbox-${todo}`} />
          <label htmlFor={`checkbox-${todo}`} className="flex-1 cursor-pointer">
            {todo}
          </label>
        </li>
      ))}
    </ul>
  );
}
