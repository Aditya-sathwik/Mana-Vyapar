const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // Merge default headers with user options
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Crucial: This allows the browser to send/receive cookies (for our secure auth)
    credentials: "include",
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API Error: ${response.status}`;
      console.error("❌ API Fetch Error Data:", errorData); // Added for debugging
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error);
    throw error;
  }
}
