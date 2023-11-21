import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

async function main() {
    //Receiving parameters
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0];

    //Configuring the provider
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const lastBlock = await provider.getBlock('latest');
    console.log(`Last block number: ${lastBlock?.number}`);
    const lastBlockTimestamp = lastBlock?.timestamp ?? 0;
    const lastBlockDate = new Date(lastBlockTimestamp * 1000);
    console.log(`Last block timestamp: ${lastBlockTimestamp} (${lastBlockDate.toLocaleDateString()} ${lastBlockDate.toLocaleTimeString()})`);

    //Attaching the smart contract using Typechain
    const ballotFactory = new TokenizedBallot__factory(wallet);
    const ballotContract = ballotFactory.attach(
        contractAddress
    ) as TokenizedBallot;

    let length = 3;
    for (let index = 0; index < length; index++) {
        let proposal = await ballotContract.proposals(index);
        console.log(`${ethers.decodeBytes32String(proposal.name)} votes: ${ethers.formatUnits(proposal.voteCount).toString()}`)
    }

    const winnerName = await ballotContract.winnerName()
    console.log(`Winning proposal: ${ethers.decodeBytes32String(winnerName)}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});