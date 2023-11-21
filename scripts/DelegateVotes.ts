import { ethers, run } from "hardhat";
import { TokenizedBallot, TokenizedBallot__factory, MyToken, MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";
import { token } from "../typechain-types/@openzeppelin/contracts";
dotenv.config();


async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "", provider);
    const wallet3 = new ethers.Wallet(process.env.PRIVATE_KEY3 ?? "", provider);
    const wallet4 = new ethers.Wallet(process.env.PRIVATE_KEY4 ?? "", provider);

    const tokenContractAddress = "0x9032F39668ad63399f8B7E534704b07de02639A0";
    const tokenFactory = new MyToken__factory(wallet);
    const tokenContract = tokenFactory.attach(
        tokenContractAddress
    ) as MyToken;

    const tokenFactory2 = new MyToken__factory(wallet2);
    const tokenContract2 = tokenFactory2.attach(
        tokenContractAddress
    ) as MyToken;

    const tokenFactory3 = new MyToken__factory(wallet3);
    const tokenContract3 = tokenFactory3.attach(
        tokenContractAddress
    ) as MyToken;

    const tokenFactory4 = new MyToken__factory(wallet4);
    const tokenContract4 = tokenFactory4.attach(
        tokenContractAddress
    ) as MyToken;

    const txTransfer = await tokenContract4.transfer(wallet3.address, ethers.parseUnits("1"));
    txTransfer.wait(3);

    await tokenContract.delegate(wallet.address);
    await tokenContract2.delegate(wallet2.address);
    await tokenContract3.delegate(wallet3.address);
    await tokenContract4.delegate(wallet4.address);

}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});