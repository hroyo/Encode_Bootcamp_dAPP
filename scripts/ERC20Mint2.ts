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

    // List of three wallet addresses
    const walletAddresses = [
        "0x90dDf1Fff5444B93AB9b832b9d4152b9507A13C3"];
    for (const address of walletAddresses) {
        const mintTx = await contract.mint(address, MINT_VALUE);
        await mintTx.wait();
        console.log(`Minted ${MINT_VALUE.toString()} decimal units to account ${address}\n`);
    }
    // const mintTx = await contract.mint(wallet.address, MINT_VALUE);
    // await mintTx.wait();
    // console.log(
    //     `Minted ${MINT_VALUE.toString()} decimal units to account ${wallet.address}\n`
    // );


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

//0x90dDf1Fff5444B93AB9b832b9d4152b9507A13C3
// "0x974BFC05C4B51d4B9d84131A9A870EEcCFB77121",
//         "0x8cd2573CE3502d85E73D7E287a1950fC1964c0E8",