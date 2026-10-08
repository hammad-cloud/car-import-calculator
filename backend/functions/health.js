import { createHandler, json } from '../src/utils/http.js';

export default createHandler(['GET'], () => json(200, { status: 'ok' }));

export const config = { path: '/api/health' };
