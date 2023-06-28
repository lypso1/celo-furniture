const { ethers } = require("hardhat");

async function main() {
  // Load the marketplace contract artifacts
  const Marketplace = await ethers.getContractFactory(
    "Marketplace"
  );

  // Deploy the contract
  const marketplace = await Marketplace.deploy();

  // Wait for deployment to finish
  await marketplace.deployed();

  // Log the address of the new contract
  console.log(
    "Marketplace deployed to:",
    marketplace.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
