import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProductform, setNewProductform] = useState({
    name: "",
    price: 0,
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
      console.log(newProductform);
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
      alert("product added");
    } catch (err) {
      alert("something Went Wrong");
    }
  }

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={addProduct}>
        <div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="enter product name"
            onChange={handleProductChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="enter product price"
            onChange={handleProductChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="imageurl"
            id="imageurl"
            placeholder="enter product image"
            onChange={handleProductChange}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>

      {products?.map((product) => (
        <div key={product?.id}>
          <h2>{product?.name}</h2>
          <p>Price: ${product?.price}</p>
          <img src={product?.imageurl} alt={product?.name} width="200" />
          <br />
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
