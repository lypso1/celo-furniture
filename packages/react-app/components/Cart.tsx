/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the product
import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractApprove } from "@/hooks/contracts/useApprove";
import { useDeleteFromCart, useReadCart } from "@/hooks/contracts/useContractCart";
import { useContractSend } from "@/hooks/contracts/useContractWrite";

// Define the interface for the product, an interface is a type that describes the properties of an object
interface Cart {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
  likes: number;
}

// Define the Cart component which takes in the id of the product and some functions to display notifications
const Cart = ({id, setError, setLoading, clear }: any) => {
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct }: any = useReadCart([address, id], true);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: purchase } = useContractSend("buyProduct", [Number(id)]);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: deleteFurniture } = useDeleteFromCart([address, id]);
  
  const [product, setProduct] = useState<Cart | null>(null);
  // Use the useContractApprove hook to approve the spending of the product's price, for the ERC20 cUSD contract
  const { writeAsync: approve } = useContractApprove(
    product?.price?.toString() || "0"
  );  


  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    if(rawProduct.owner !== "0x0000000000000000000000000000000000000000") {
      setProduct({
        owner: rawProduct[0],
        name: rawProduct[1],
        image: rawProduct[2],
        description: rawProduct[3],
        location: rawProduct[4],
        price: Number(rawProduct[5]),
        sold: rawProduct[6].toString(),
        likes: Number(rawProduct[7]),
      });
    } else {
      setProduct(null);
    }
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handlePurchase = async () => {
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }
    // Approve the spending of the product's price, for the ERC20 cUSD contract
    const approveTx = await approve();
    // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
    await approveTx.wait();
    setLoading("Purchasing...");
    // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
    const res = await purchase();
    // Wait for the transaction to be mined
    await res.wait();
  };


  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const purchaseProduct = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handlePurchase(), {
        pending: "Purchasing product...",
        success: "Cart purchased successfully",
        error: "Failed to purchase product",
      });
      // If there is an error, display the error message
    } catch (e: any) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the purchase is complete, clear the loading state
    } finally {
      setLoading(null);
    }
  };

  const deleteFromCart = async() => {
    setLoading("Approving ...");
    clear();
    try {
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(async() => {
        if (!deleteFurniture) {
          throw "Failed to delete furniture";
        }
        setLoading("Deleting...");
        // Once the transaction is mined, delete furniture via our marketplace contract removeFromCart function
        const res = await deleteFurniture();
        // Wait for the transaction to be mined
        await res.wait();
      }, {
        pending: "Deleting product...",
        success: "Furniture deleted successfully",
        error: "Failed to delete from cart",
      });
      // If there is an error, display the error message
    } catch (e: any) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the delete is complete, clear the loading state
    } finally {
      setLoading(null);
    }
  }
  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Return the JSX for the product component
  return (
    <div className="flex h-40 overflow-hidden items-start justify-between shadow-lg relative rounded-b-lg">
      <div className="relative w-1/2 h-full">
        {/* Show the number of products sold */}
        <span
          className={
            "absolute z-10 right-0 mt-4 bg-slate-300 text-black font-bold p-1 rounded-l-lg px-4 shadow"
            }
          >
            {product.sold} sold
          </span>
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-full rounded-t-md object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute bottom-0 h-12 w-12 overflow-hidden rounded-full"}
          >
            {identiconTemplate(product.owner)}
          </Link>
        </div>

        <div className={"relative px-4 pb-4 w-1/2 h-full flex flex-col justify-between"}>
          <div
            onClick={deleteFromCart}
            className="absolute border cursor-pointer border-slate-300 right-4 top-2"
          >
            <img width="24" height="24" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" alt="delete-sign--v1"/>
          </div>
          <div>
            {/* Show the product name */}
            <p className="mt-0 text-2xl font-bold">{product.name}</p>
            
          </div>

          <div className="flex justify-between items-start flex-col flex-wrap gap-4">
            <div className={"flex items-center justify-between flex-row"}>
              {/* Show the product location */}
              <h3 className="pt-1 -ml-1 flex items-center justify-start text-sm text-gray-700">
                <img src={"/location.svg"} alt="Location" className={"w-6"} />
                {product.location}
              </h3>
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            <div className="">
              <button
                onClick={purchaseProduct}
                className="border-[1px] px-2 py-1 border-gray-500 text-black rounded-lg hover:bg-black hover:text-white"
              >
                {/* Show the product price in cUSD */}
                Buy {productPriceFromWei} cUSD
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Cart;