const BASE_URL = "http://127.0.0.1:8080"; 

export interface BoxItem {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  label: string;
  weight: number;
}

export interface BoxCreate {
  name: string;
  length: number;
  width: number;
  height: number;
  label: string;
  weight: number;
}

export const fetchItems = async (): Promise<BoxItem[]> => {
  try {
    const res = await fetch(`${BASE_URL}/boxes`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Network response was not ok: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const createBox = async (box: BoxCreate): Promise<BoxItem> => {
  try {
    const res = await fetch(`${BASE_URL}/boxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(box),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Network response was not ok: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating box:", error);
    throw error;
  }
};
