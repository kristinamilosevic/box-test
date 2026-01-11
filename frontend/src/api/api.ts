const BASE_URL = "http://127.0.0.1:8000"; 

export interface BoxItem {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
}

export interface BoxCreate {
  name: string;
  length: number;
  width: number;
  height: number;
}

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 5000) => {
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
};

export const fetchItems = async (): Promise<BoxItem[]> => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/boxes`, {}, 5000);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Network response was not ok: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Backend is not responding. Please check if the backend is running.');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please check if the backend is running on http://127.0.0.1:8000');
    }
    throw error;
  }
};

export const createBox = async (box: BoxCreate): Promise<BoxItem> => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/boxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(box),
    }, 5000);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Network response was not ok: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating box:", error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Backend is not responding. Please check if the backend is running.');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please check if the backend is running on http://127.0.0.1:8000');
    }
    throw error;
  }
};
