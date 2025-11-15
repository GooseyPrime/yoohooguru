/**
 * API Helper Utilities
 * Provides retry logic, error handling, and fallback mechanisms for API calls
 */

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoff?: boolean;
}

interface FetchWithRetryOptions extends RetryOptions {
  timeout?: number;
}

/**
 * Fetch with automatic retry logic
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoff = true,
    timeout = 10000,
  } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is ok, return it
      if (response.ok) {
        return response;
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // For server errors (5xx), retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on abort (timeout)
      if (lastError.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with optional exponential backoff
      const delay = backoff ? retryDelay * Math.pow(2, attempt) : retryDelay;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * Fetch JSON with retry logic and error handling
 */
export async function fetchJSON<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: FetchWithRetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryOptions);
  return response.json();
}

/**
 * Safe API call with fallback value
 */
export async function safeAPICall<T>(
  apiCall: () => Promise<T>,
  fallbackValue: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API call failed:', err);
    }

    // Call error handler if provided
    if (onError) {
      onError(err);
    }

    return fallbackValue;
  }
}

/**
 * Check if API is available
 */
export async function checkAPIHealth(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get API URL with fallback
 */
export function getAPIUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.yoohoo.guru';
}

/**
 * Build API endpoint URL
 */
export function buildAPIUrl(path: string): string {
  const baseUrl = getAPIUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Error messages for common HTTP status codes
 */
export function getErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Unauthorized. Please sign in.',
    403: 'Access denied. You don\'t have permission.',
    404: 'Resource not found.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. The server is temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. The request took too long.',
  };

  return messages[statusCode] || 'An unexpected error occurred.';
}