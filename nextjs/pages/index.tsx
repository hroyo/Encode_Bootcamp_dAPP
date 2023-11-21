import type { NextPage } from "next";
import { useAccount, useNetwork, useSignMessage, useBalance, useContractRead, useContractWrite } from 'wagmi'
import React, { useState, useEffect } from 'react';
import { parseUnits, formatUnits } from 'viem'


const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody></PageBody>

        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo></WalletInfo>
      <RandomWord></RandomWord>

    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const myNumber = Math.random() - Math.random();

  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletAction></WalletAction>
        <WalletBalance address={address as `0x${string}`}></WalletBalance>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
        <ApiData address={address as `0x${string}`}></ApiData>
        <DelegateVote address={address as `0x${string}`}></DelegateVote>
        <CastVotes></CastVotes>
      </div>
    );
  if (isDisconnected) return (
    <div>
      <p>Diskonnected…</p>
    </div>
  );
  return (
    <div>
      <p> Connekt Wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isLoading}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}


function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  console.log("Rendered!");
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}
function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useContractRead wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}
function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x9032F39668ad63399f8B7E534704b07de02639A0",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}
function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0x9032F39668ad63399f8B7E534704b07de02639A0",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}
function ApiData(params: { address: `0x${string}` }) {
  const [transactionHash, setTransactionHash] = useState<{ transactionHash?: string; error?: string }>({});
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing API Coupling</h2>
        <TokenAddressFromApi></TokenAddressFromApi>
        <RequestTokens address={params.address}></RequestTokens>
        {/* <p>Transaction Hash: {transactionHash.transactionHash}</p>
        {transactionHash.error && <p>Error: {transactionHash.error}</p>} */}
      </div>
    </div>
  );
}
function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.result}</p>
    </div>
  );
}

function RequestTokens(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean; transactionHash: string; error?: string }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Request tokens
      </button>
    );

  return (
    <div>
      {data && (
        <>
          <p>Result from API: {data.result ? 'worked' : 'failed'}</p>
          {data.transactionHash && <p>Transaction Hash: {data.transactionHash}</p>}
          {data.error && <p>Error: {data.error}</p>}
        </>
      )}
    </div>
  );
}
function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}

function DelegateVote(params: { address: `0x${string}` }) {
  const [address, setAddress] = useState<string>('');
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x9032F39668ad63399f8B7E534704b07de02639A0',
    abi: [
      {
        constant: false,
        inputs: [
          {
            internalTyp: "address",
            name: "delegatee",
            type: "address"
          }
        ],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    functionName: 'delegate',
  })
  return (
    <div>
      <label>
        Enter Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <button onClick={() => write({ args: [params.address] })}>Delegate Vote</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}
function CastVotes() {
  const [proposal, setProposal] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x516153Bb173ebF6f1c93a0Ad26A0905a6fEdD430',
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "proposal",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    functionName: 'vote',
  })
  return (
    <div>
      <label>
        Vote for proposal:
        <input
          type="number"
          value={proposal}
          onChange={(e) => setProposal(Number(e.target.value))}
        />
      </label>
      <label>
        Enter Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <button onClick={() => write({ args: [proposal, amount] })}>castVote</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}




export default Home;