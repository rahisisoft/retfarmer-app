import UserLayout from "@/components/UserLayout";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { cart } = useCart(); // Get the cart from the context
  const [items, setItems] = useState([]);

  // Initialize items with quantities
  useEffect(() => {
    const initializedItems = cart.map((item) => ({
      ...item,
      quantity: 1, // Default quantity
    }));
    setItems(initializedItems);
  }, [cart]);

  const removeFromCart = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    // Ensure quantity is valid (>= 1) and update state
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, parseInt(newQuantity) || 1) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <UserLayout>
      <h1 className="my-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your Cart is empty</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong>
                  <p className="mb-1">Price: Fbu {item.price.toFixed(2)}</p>
                  <div className="d-flex align-items-center">
                    <label htmlFor={`quantity-${item.id}`} className="me-2">
                      Quantity:
                    </label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: "80px" }}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h4>Total: Fbu {calculateTotal().toFixed(2)}</h4>
        </>
      )}
    </UserLayout>
  );
}
