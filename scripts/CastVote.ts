import { ethers, run } from "hardhat";
import { TokenizedBallot, TokenizedBallot__factory, MyToken, MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";
dotenv.config();


async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "", provider);
    const wallet3 = new ethers.Wallet(process.env.PRIVATE_KEY3 ?? "", provider);

    const contractAddress = "0xc7C74623e5a4AA4bf4933720a47DF193Ac661261";
    const ballotFactory = new TokenizedBallot__factory(wallet);
    const ballotContract = ballotFactory.attach(
        contractAddress
    ) as TokenizedBallot;

    const ballotFactory2 = new TokenizedBallot__factory(wallet2);
    const ballotContract2 = ballotFactory2.attach(
        contractAddress
    ) as TokenizedBallot;

    const ballotFactory3 = new TokenizedBallot__factory(wallet3);
    const ballotContract3 = ballotFactory3.attach(
        contractAddress
    ) as TokenizedBallot;

    await ballotContract.vote(1, ethers.parseUnits("1"));
    await ballotContract2.vote(1, ethers.parseUnits("1"));
    await ballotContract3.vote(2, ethers.parseUnits("2"));

}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});