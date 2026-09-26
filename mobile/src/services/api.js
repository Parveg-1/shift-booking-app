import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/api';

export class ApiError extends Error {
  constructor(message, { status = null, code = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const readBody = (response) =>
  response
    .json()
    .then((payload) => payload)
    .catch(() => null);

const request = async (path, { method = 'GET', body } = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : null),
      },
      ...(body ? { body } : null),
    });
  } catch (error) {
    throw new ApiError(
      error.name === 'AbortError'
        ? 'The request timed out. Please try again.'
        : `Cannot reach the API at ${API_BASE_URL}.`,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = await readBody(response);

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed (${response.status}).`, {
      status: response.status,
      code: payload?.error,
    });
  }

  return payload;
};

const mutateShift = (id, action) =>
  request(`/shifts/${id}/${action}`, { method: 'POST', body: JSON.stringify({}) });

export const getShifts = () => request('/shifts');

export const getShift = (id) => request(`/shifts/${id}`);

export const bookShift = (id) => mutateShift(id, 'book');

export const cancelShift = (id) => mutateShift(id, 'cancel');
