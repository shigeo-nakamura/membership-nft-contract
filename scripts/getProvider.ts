import { ethers } from "ethers";
import dotenv from 'dotenv'

dotenv.config()

export const getProvider = () => {
  const infuraProvider = new ethers.providers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );

  return infuraProvider;
};
