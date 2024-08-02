"use server";

export async function addTodo(formData: FormData) {
  const todo = formData.get("todo");
  console.log(todo);
}
