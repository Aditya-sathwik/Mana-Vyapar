const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  isMultipart?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiOptions = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
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
  delete (defaultOptions as any).isMultipart;

  try {
    const response = await fetch(url, defaultOptions);
    
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
