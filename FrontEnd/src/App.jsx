import React, { useEffect, useState } from "react";

const getEthereumObject = () => window.ethereum;


const findMetaMaskAccount = async() => {
  try {
    const ethereum = getEthereumObject()
    if (!ethereum) {
      console.log('Please install metamask')
      return null
    }
    console.log(`We have etherium object ${ethereum}`)
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch(error) {
    console.log(error)
    return null;
  }
}


export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async() => {
    try {
      const ethereum = getEthereumObject()
      if (!ethereum) {
        alert("get metamask")
        return
      }
      const accounts = ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    const getAccount = async() => {
      const account = await findMetaMaskAccount()
      if (!account!=null) {
        setCurrentAccount(account)
      }
    }
    getAccount()
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Hoang, besides chocolate and other sweetness goodies
        <br/>I really love a good wave.
        <br/>Connect your Ethereum wallet and wave at me!
        </div>
        <div className="waveButton">
        <button onClick={null}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
