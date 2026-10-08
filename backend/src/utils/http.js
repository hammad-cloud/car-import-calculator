import { AppError } from './AppError.js';

export function json(status, body) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Wraps a Netlify Function handler: enforces the allowed methods and turns errors into
 * one response shape: { error: { message, details? } }.
 */
export function createHandler(methods, handler) {
  return async (req, context) => {
    try {
      if (!methods.includes(req.method)) {
        throw new AppError(405, `Method ${req.method} not allowed. Use ${methods.join(', ')}.`);
      }
      return await handler(req, context);
    } catch (err) {
      if (err instanceof AppError) {
        return json(err.statusCode, {
          error: { message: err.message, ...(err.details && { details: err.details }) },
        });
      }
      console.error(err);
      return json(500, { error: { message: 'Internal server error' } });
    }
  };
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    throw new AppError(400, 'Request body must be valid JSON');
  }
}
