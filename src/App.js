import { useEffect, useState } from "react";
import useLocalStorage from "react-hook-local-web-storage";

const products = [
  {
    id: 1,
    name: "My product",
  },
  {
    id: 2,
    name: "My other product",
  },
  {
    id: 3,
    name: "My yet another product",
  },
];

const App = () => {
  const [localStorageValue, setLocalStorageValue] = useLocalStorage("myKey");
  const [state, setState] = useState([]);

  useEffect(() => {
    if (localStorageValue) {
      setState(JSON.parse(localStorageValue));
    }
  }, [localStorageValue]);

  const addProductToCart = (id) => {
    const isProductAlreadyInCart = state.find(
      (cartItem) => id === cartItem.productId
    );
    let newCartState = [];
    if (isProductAlreadyInCart) {
      newCartState = [
        ...state.map((cartItem) => {
          if (cartItem.productId !== id) {
            // Let's put all the other products in the new cart
            return cartItem;
          } else {
            // Let's put the current product in the cart
            return {
              // Let's use the same ID as before
              productId: cartItem.productId,
              // Find the previous quantity, and increase it by one
              quantity: cartItem.quantity + 1,
            };
          }
        }),
      ];
    } else {
      newCartState = [
        ...state,
        {
          productId: id,
          quantity: 1,
        },
      ];
    }
    setLocalStorageValue(JSON.stringify(newCartState));
  };

  const removeProductFromCart = (id) => {
    let newCartState = state.filter((cartItem) => cartItem.productId !== id);
    setLocalStorageValue(JSON.stringify(newCartState));
  };

  return (
    <div className="App">
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name}</p>
          <button
            onClick={() => {
              addProductToCart(product.id);
            }}
          >
            Add to cart
          </button>
        </div>
      ))}
      <div>
        <h1>Cart:</h1>
        {state.map((cartItem) => (
          <div key={cartItem.productId}>
            {products.find((product) => cartItem.productId === product.id).name}
            ({cartItem.quantity})
            <button
              onClick={() => {
                removeProductFromCart(cartItem.productId);
              }}
            >
              Remove items from cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
