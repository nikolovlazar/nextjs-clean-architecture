'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { SESSION_COOKIE } from '@/config';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, NotFoundError } from '@/src/entities/errors/common';
import { getInjection } from '@/di/container';

export async function createTodo(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'createTodo',
    { recordResponse: true },
    async () => {
      try {
        const data = Object.fromEntries(formData.entries());
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        const createTodoController = getInjection('ICreateTodoController');
        await createTodoController(data, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a todo' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while creating a todo. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}

export async function toggleTodo(todoId: number) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'toggleTodo',
    { recordResponse: true },
    async () => {
      try {
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        const toggleTodoController = getInjection('IToggleTodoController');
        await toggleTodoController({ todoId }, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a todo' };
        }
        if (err instanceof NotFoundError) {
          return { error: 'Todo does not exist' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while toggling the todo. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}

export async function bulkUpdate(dirty: number[], deleted: number[]) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'bulkUpdate',
    { recordResponse: true },
    async () => {
      try {
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        const bulkUpdateController = getInjection('IBulkUpdateController');
        await bulkUpdateController({ dirty, deleted }, sessionId);
      } catch (err) {
        revalidatePath('/');
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to bulk update todos' };
        }
        if (err instanceof NotFoundError) {
          return { error: 'Todo does not exist' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while bulk updating the todos. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}
