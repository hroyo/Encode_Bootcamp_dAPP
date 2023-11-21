import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  contract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  ballotContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_ENDPOINT_URL'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      this.provider,
    );
    this.contract = new ethers.Contract(
      this.configService.get<string>('TOKEN_ADDRESS'),
      tokenJson.abi,
      this.wallet,
    );
    this.ballotContract = new ethers.Contract(
      this.configService.get<string>('BALLOT_ADDRESS'),
      ballotJson.abi,
      this.wallet,
    );
  }

  async getTotalSupply() {
    const totalSupply = await this.contract.totalSupply();
    return ethers.formatUnits(totalSupply);
  }
  async getTokenBalance(address: string) {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance);
  }
  getTransactionReceipt(hash: string) {
    throw new Error('Method not implemented.');
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS');
  }

  async getTokenName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }
  getServerWalletAddress() {
    return this.wallet.address;
  }
  async checkMinterRole(address: string) {
    const MINTER_ROLE = await this.contract.MINTER_ROLE();
    console.log(MINTER_ROLE);
    const hasRole = await this.contract.hasRole(MINTER_ROLE, address);
    return hasRole;
  }
  async mintTokens(amount: string, toAddress: string) {
    try {
      const hasMinterRole = await this.checkMinterRole(this.wallet.address);
      if (!hasMinterRole) {
        throw new Error('The Server Wallet is do not have the MINTER_ROLE');
      }

      const amountToMint = '10';
      const amountInBaseUnits = ethers.parseUnits(amountToMint, 18);
      const transaction = await this.contract.mint(toAddress, amountInBaseUnits);
      await transaction.wait();
      console.log('Tokens minted successfully. Transaction hash:', transaction.hash);

      return {
        success: true,
        transactionHash: transaction.hash,

      };
    } catch (error) {
      console.error('Error minting tokens:', error.message);

      return {
        success: false,
        error: error.message,
      };
    }
  }
  async delegateVote(address: string, sig: string) {
    const delegateVoteTx = await this.contract.delegate(address);
    await delegateVoteTx.wait();
    return delegateVoteTx.hash
  }

  getBallotAddress(): string {
    return this.configService.get<string>('BALLOT_ADDRESS');
  }

  async getVotingPower(address: string) {
    const votingPower = await this.ballotContract.votingPower(address);
    return ethers.formatUnits(votingPower);
  }

  async proposal0() {
    const proposal0 = await this.ballotContract.proposals(0);
    return { 'name': ethers.decodeBytes32String(proposal0.name), 'votes': ethers.formatUnits(proposal0.voteCount).toString() }
  }

  async proposal1() {
    const proposal1 = await this.ballotContract.proposals(1);
    return { 'name': ethers.decodeBytes32String(proposal1.name), 'votes': ethers.formatUnits(proposal1.voteCount).toString() }
  }

  async proposal2() {
    const proposal2 = await this.ballotContract.proposals(2);
    return { 'name': ethers.decodeBytes32String(proposal2.name), 'votes': ethers.formatUnits(proposal2.voteCount).toString() }
  }

  async getWinnerName() {
    const winnerName = await this.ballotContract.winnerName();
    return ethers.decodeBytes32String(winnerName);
  }
}