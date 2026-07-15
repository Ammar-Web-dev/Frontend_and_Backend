import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProductform, setNewProductform] = useState({
    name: "",
    price: "",
    imageurl: "",
  });

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/products/${id}`);

      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productRef = await axios.get("http://localhost:5050/products");

        setProducts(productRef.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProducts();
  }, []);

  function handleProductChange(e) {
    setNewProductform((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function addProduct(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5050/products",
        {
          ...newProductform,
          id: products.length + 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      alert("Product Added Successfully!");

      setProducts([
        ...products,
        {
          ...newProductform,
          id: products.length + 1,
        },
      ]);

      setNewProductform({
        name: "",
        price: "",
        imageurl: "",
      });
    } catch (err) {
      alert("Something Went Wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          Product Management
        </h1>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Add New Product
          </h2>

          <form onSubmit={addProduct} className="grid md:grid-cols-3 gap-5">
            <input
              type="text"
              name="name"
              value={newProductform.name}
              placeholder="Product Name"
              onChange={handleProductChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              name="price"
              value={newProductform.price}
              placeholder="Product Price"
              onChange={handleProductChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="imageurl"
              value={newProductform.imageurl}
              placeholder="Image URL"
              onChange={handleProductChange}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold text-lg shadow-lg"
            >
              + Add Product
            </button>
          </form>
        </div>

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2"
            >
              <div className="h-60 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.imageurl}
                  alt={product.name}
                  className="object-contain h-full w-full"
                  onError={(e) => {
                    console.log("Image failed:", product.imageurl);
                  }}
                />
              </div>

              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold text-gray-800">
                  {product.name}
                </h2>

                <p className="text-2xl font-bold text-green-600">
                  ${product.price}
                </p>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg font-semibold"
                >
                  Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center mt-20 text-gray-300 text-xl">
            No Products Available
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
