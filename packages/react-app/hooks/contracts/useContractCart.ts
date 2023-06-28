// This hook is used to read  from and make write calls to a smart contract (send transactions)

// Import the wagmi hook to read from a smart contract
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
// Import the Marketplace ABI(Interface)
import MarketplaceInstance from "../../abi/Marketplace.json";
// Import BigNumber from ethers to handle big numbers used in Celo
import { BigNumber } from "ethers";

// read from smart contract
export const useReadCart = (args?: Array<any>, watch?: boolean, from?: `0x${string}` | undefined) => {
  const resp = useContractRead({
    // The address of the smart contract, in this case the Marketplace from the JSON file
    address: MarketplaceInstance.address as `0xreadCart`,
    // The ABI of the smart contract, in this case the Marketplace from the JSON file
    abi: MarketplaceInstance.abi,
    // The smart contract function name to call
    functionName: "readCart",
    // The arguments to pass to the smart contract function
    args,
    // A boolean to watch for changes in the smart contract. If true, the hook will re-run when the smart contract changes
    watch,
    // The address of the user to call the smart contract function from which is optional
    overrides: from ? { from } : undefined,
    onError: (err) => {
      console.log({ err });
    },
  });

  return resp;
};
// read from smart contract
export const useCartLength = (args?: Array<any>, watch?: boolean, from?: `0x${string}` | undefined) => {
  const resp = useContractRead({
    // The address of the smart contract, in this case the Marketplace from the JSON file
    address: MarketplaceInstance.address as `0xcartLength`,
    // The ABI of the smart contract, in this case the Marketplace from the JSON file
    abi: MarketplaceInstance.abi,
    // The smart contract function name to call
    functionName: "cartLength",
    // The arguments to pass to the smart contract function
    args,
    // A boolean to watch for changes in the smart contract. If true, the hook will re-run when the smart contract changes
    watch,
    // The address of the user to call the smart contract function from which is optional
    overrides: from ? { from } : undefined,
    onError: (err) => {
      console.log({ err });
    },
  });

  return resp;
};


// write to a smart contract
export const useDeleteFromCart = (args: Array<any>) => {
  // The gas limit to use when sending a transaction
  const gasLimit = BigNumber.from(1000000);

  // Prepare the write to the smart contract
  const { config } = usePrepareContractWrite({
    // The address of the smart contract, in this case the Marketplace from the JSON file
    address: MarketplaceInstance.address as `0xremoveFromCart`,
    // The ABI of the smart contract, in this case the Marketplace from the JSON file
    abi: MarketplaceInstance.abi,
    // The smart contract function name to call
    functionName: "removeFromCart",
    // The arguments to pass to the smart contract function
    args,
    // The gas limit to use when sending a transaction
    overrides: {
      gasLimit,
    },
    onError: (err) => {
      console.log({ err });
    },
  });

  // Write to the smart contract using the prepared config
  const { data, isSuccess, write, writeAsync, error, isLoading } =
    useContractWrite(config);
  return { data, isSuccess, write, writeAsync, isLoading };
};

// write to a smart contract
export const useAddToCart = (args: Array<any>) => {
  // The gas limit to use when sending a transaction
  const gasLimit = BigNumber.from(1000000);

  // Prepare the write to the smart contract
  const { config } = usePrepareContractWrite({
    // The address of the smart contract, in this case the Marketplace from the JSON file
    address: MarketplaceInstance.address as `0xaddToCart`,
    // The ABI of the smart contract, in this case the Marketplace from the JSON file
    abi: MarketplaceInstance.abi,
    // The smart contract function name to call
    functionName: "addToCart",
    // The arguments to pass to the smart contract function
    args,
    // The gas limit to use when sending a transaction
    overrides: {
      gasLimit,
    },
    onError: (err) => {
      console.log({ err });
    },
  });

  // Write to the smart contract using the prepared config
  const { data, isSuccess, write, writeAsync, error, isLoading } =
    useContractWrite(config);
  return { data, isSuccess, write, writeAsync, isLoading };
};