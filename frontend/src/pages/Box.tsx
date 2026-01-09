import React, { useEffect, useState } from "react";
import { fetchItems, createBox, BoxItem, BoxCreate } from "../api/api";

const Box: React.FC = () => {
  const [items, setItems] = useState<BoxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BoxCreate>({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    label: "No",
    weight: 0,
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      setItems(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load boxes";
      setError(errorMessage);
      console.error("Error loading boxes:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createBox(formData);
      setFormData({
        name: "",
        length: 0,
        width: 0,
        height: 0,
        label: "No",
        weight: 0,
      });
      await loadItems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create box";
      setError(errorMessage);
      console.error("Error creating box:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {error && (
        <div className="text-red-600 mb-5 p-3 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="mb-10 p-5 border border-gray-300 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Create New Box</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-semibold">
                Length (mm):
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Width (mm):
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Height (mm):
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Weight (kg):
              </label>
              <input
                type="number"
                name="weigth"
                value={formData.weight}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Label:
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className={`px-5 py-2.5 text-base text-white rounded ${
              submitting 
                ? "bg-green-400 cursor-not-allowed opacity-60" 
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }`}
          >
            {submitting ? "Creating..." : "Create Box"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Boxes ({items.length})</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : items.length === 0 ? (
          <p className="p-5 text-center text-gray-600">No boxes found.</p>
        ) : (
          <div className="grid gap-2.5">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="p-4 border border-gray-300 rounded-lg bg-white"
              >
                <div>
                  <strong className="text-lg">{item.name}</strong>
                  <div className="text-gray-600 mt-1">
                    Dimensions: {item.length} × {item.width} × {item.height}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Box;