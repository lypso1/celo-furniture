// This component is used to add a product to the marketplace and show the user's cUSD balance

// Importing the dependencies
import { useState } from "react";
import Cart from "./Cart";
import { useCartLength } from "@/hooks/contracts/useContractCart";
import { useAccount } from "wagmi"

// The ProductCart component is used to add a product to the marketplace
const ProductCart = () => {
  const { address } = useAccount()
  // Use the useContractCall hook to read how many products are in the marketplace contract
  const { data }:any = useCartLength([address], true);
  // Convert the data to a number
  const cartLength = data ? Number(data.toString()) : 0;
  // Define the states to store the error, success and loading messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // The visible state is used to toggle the modal
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState("");
  // Define a function to clear the error, success and loading states
  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };
  
  // Define a function to return the products
  const cart = () => {
    // If there are no products, return null
    if (!cartLength) {
      return (
        <>
          <p>Cart Empty</p>
        </>
      )
    }
    const products = [];
    // Loop through the products, return the Product component and push it to the products array
    for (let i = 0; i < cartLength; i++) {
      products.push(
        <Cart
          key={i}
          id={i}
          setSuccess={setSuccess}
          setError={setError}
          setLoading={setLoading}
          loading={loading}
          clear={clear}
        />
      );
    }
    return products;
  };

  // Define the JSX that will be rendered
  return (
    <div className={"flex flex-row justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="inline-block px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          My Cart
        </button>

        {/* Modal */}
        {visible && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
             {/* Form with input fields for the product, that triggers the addProduct function on submit */}
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Input fields for the product */}
                  <div className="h-500 overflow-y-scroll bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h1 className="w-full text-center text-2xl font-bold mb-8 underline underline-offset-4">My Cart</h1>
                    <div className="flex flex-col gap-y-8">
                      {/* Loop through the products and return the Product component */}
                      {cart()}
                    </div>

                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCart;