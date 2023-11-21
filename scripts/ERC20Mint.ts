import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.parseUnits("10");

async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const contractAddress = "0x9032F39668ad63399f8B7E534704b07de02639A0"; // Replace with your contract address
    const contract = MyToken__factory.connect(contractAddress, wallet);

    const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "", provider);
    const wallet3 = new ethers.Wallet(process.env.PRIVATE_KEY3 ?? "", provider);
    const wallet4 = new ethers.Wallet(process.env.PRIVATE_KEY4 ?? "", provider);
    const walletAddresses = [
        wallet.address, wallet2.address, wallet3.address, wallet4.address
    ];
    for (const address of walletAddresses) {
        const mintTx = await contract.mint(address, MINT_VALUE);
        await mintTx.wait(3);
        console.log(`Minted ${MINT_VALUE.toString()} decimal units to account ${address}\n`);
    }

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});