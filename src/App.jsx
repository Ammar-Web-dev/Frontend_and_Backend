import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Pencil, Trash2, Plus, X, Loader2, ImageOff } from "lucide-react";

const API_URL = "https://mvc-production-f0fc.up.railway.app/products";

const emptyForm = { name: "", price: "", imageurl: "" };

function Spinner({ size = "h-5 w-5", color = "text-white" }) {
  return <Loader2 className={`animate-spin ${size} ${color}`} />;
}

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoadingProducts(true);
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      imageurl: product.imageurl,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        // ---- EDIT ----
        await axios.put(`${API_URL}/${editingId}`, form, {
          headers: { "Content-Type": "application/json" },
        });

        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)),
        );
        setEditingId(null);
      } else {
        // ---- ADD ----
        const newProduct = { ...form, id: Date.now() };

        await axios.post(API_URL, newProduct, {
          headers: { "Content-Type": "application/json" },
        });

        setProducts((prev) => [...prev, newProduct]);
      }

      setForm(emptyForm);
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct(id) {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      console.log(err);
      alert("Could not delete this product.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              PM
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                Product Management
              </h1>
              <p className="text-xs text-slate-500">
                {isLoadingProducts
                  ? "Loading catalog…"
                  : `${products.length} product${products.length === 1 ? "" : "s"} in catalog`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Form */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                <X className="h-4 w-4" />
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                placeholder="e.g. Wireless Mouse"
                onChange={handleChange}
                className="rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600">
                Price
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={form.price}
                placeholder="e.g. 29.99"
                onChange={handleChange}
                className="rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600">
                Image URL
              </label>
              <input
                type="text"
                name="imageurl"
                value={form.imageurl}
                placeholder="https://…"
                onChange={handleChange}
                className="rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-3"
            >
              {isSaving ? (
                <>
                  <Spinner />
                  {editingId ? "Updating…" : "Adding…"}
                </>
              ) : editingId ? (
                "Update Product"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Product
                </>
              )}
            </button>
          </form>
        </section>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Spinner size="h-8 w-8" color="text-indigo-500" />
            <p className="mt-4 text-sm">Loading products…</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <p className="text-lg font-medium text-slate-700">
              {search ? "No matching products" : "No products yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Add your first product using the form above."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl ${
                  editingId === product.id
                    ? "border-indigo-400 ring-2 ring-indigo-100"
                    : "border-slate-200"
                }`}
              >
                {(deletingId === product.id ||
                  (isSaving && editingId === product.id)) && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm">
                    <Spinner size="h-7 w-7" color="text-indigo-500" />
                    <span className="text-xs font-medium text-slate-600">
                      {deletingId === product.id ? "Deleting…" : "Saving…"}
                    </span>
                  </div>
                )}

                <div className="flex h-52 items-center justify-center overflow-hidden bg-slate-50">
                  {product.imageurl ? (
                    <img
                      src={product.imageurl}
                      alt={product.name}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <ImageOff className="h-8 w-8" />
                      <span className="text-xs text-slate-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-emerald-600">
                    ${product.price}
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => startEdit(product)}
                      title="Edit product"
                      aria-label="Edit product"
                      className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 py-2 text-slate-700 transition-all duration-200 hover:scale-[1.03] hover:bg-slate-50 hover:text-indigo-600 active:scale-95"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={deletingId === product.id}
                      title="Delete product"
                      aria-label="Delete product"
                      className="flex flex-1 items-center justify-center rounded-lg bg-red-600 py-2 text-white transition-all duration-200 hover:scale-[1.03] hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {deletingId === product.id ? (
                        <Spinner size="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;