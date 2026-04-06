const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  isMultipart?: boolean;
}

let isRefreshing = false;

export async function apiFetch(endpoint: string, options: ApiOptions = {}): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;
  const retryCount = (options as any)._retryCount || 0;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // If not multipart, we assume JSON
  if (!options.isMultipart) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  // Remove our custom property before passing to window.fetch
  const { isMultipart, _retryCount, ...fetchOptions } = defaultOptions as any;

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 401 Unauthorized - Attempt Token Refresh
    if (
      response.status === 401 &&
      !url.includes("/users/refresh-token") &&
      !url.includes("/users/login") &&
      retryCount < 1
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/users/refresh-token`, {
            method: "POST",
            credentials: "include",
          });

          isRefreshing = false;

          if (refreshRes.ok) {
            // Retry the original request with incremented retry count
            return await apiFetch(endpoint, { ...options, _retryCount: retryCount + 1 } as any);
          }
        } catch (err) {
          isRefreshing = false;
          console.error("Auto-refresh failed:", err);
        }
      } else {
        // If already refreshing, wait a bit and retry (simple wait)
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await apiFetch(endpoint, { ...options, _retryCount: retryCount + 1 } as any);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API Error: ${response.status}`;
      console.error("❌ API Fetch Error Data:", errorData);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error);
    throw error;
  }
}


