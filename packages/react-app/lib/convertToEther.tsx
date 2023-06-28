import { ethers } from 'ethers';

export function convertToEther(number: any) {
  const etherValue = ethers.utils.formatEther(number.toString());
  return etherValue;
}
