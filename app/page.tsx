import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { Todo } from '@/src/entities/models/todo';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './_components/ui/card';
import { Separator } from './_components/ui/separator';
import { UserMenu } from './_components/ui/user-menu';
import { CreateTodo } from './add-todo';
import { Todos } from './todos';
import { getInjection } from '@/di/container';

async function getTodos(sessionId: string | undefined) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'getTodos',
      op: 'function.nextjs',
    },
    async () => {
      try {
        const getTodosForUserController = getInjection(
          'IGetTodosForUserController'
        );
        return await getTodosForUserController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}

export default async function Home() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  let todos: Todo[];
  try {
    todos = await getTodos(sessionId);
  } catch (err) {
    throw err;
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
        <Todos todos={todos} />
      </CardContent>
    </Card>
  );
}
