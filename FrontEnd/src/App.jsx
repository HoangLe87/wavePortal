import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import wavePortal from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

export default function App() {
  const contractAddress = "0x1E9E3BE45963bC1c9d1aF148B2e9CC6e430bee79";
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("please install metamask");
        return;
      } else {
        console.log(`Found ethereum object ${ethereum}`);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Found authorised acccount ${account}`);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorised accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get metamask");
        return;
      }
      const accounts = ethereum.request({ method: "eth_requestAccounts" });
      console.log(`Connected with ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          wavePortal.abi,
          signer
        );
        const waveTxn = await wavePortalContract.wave(inputMessage, {
          gasLimit: 300000,
        });
        setInputMessage("");
        console.log(`Mining...${waveTxn.hash}`);
        await waveTxn.wait();
        console.log(`Mined -- ${waveTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return [date.getDate(), date.getMonth(), date.getFullYear()].join("/");
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          wavePortal.abi,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach((i) => {
          let time = new Date(Number(i.timestamp) * 1000);
          wavesCleaned.push({
            address: i.waver,
            timestamp: formatDate(time),
            message: i.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    let wavePortalContract;
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      let time = new Date(Number(timestamp) * 1000);
      setAllWaves((i) => [
        ...i,
        {
          address: from,
          timestamp: formatDate(time),
          message: message,
        },
      ]);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am Hoang, besides chocolate and other sweetness goodies
          <br />I really love a good wave.
        </div>
        <form className="bio" onSubmit={wave}>
          <label htmlFor="message">Type in your message: </label>
          <input
            type="text"
            name="message"
            id="message"
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
          ></input>
          <div>
            <button type="submit">Wave at Me</button>
          </div>
        </form>
        <div>
          {!currentAccount && (
            <div className="bio">
              <div>Connect your Ethereum wallet and wave at me!</div>
              <button className="waveButton" onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>
          )}
        </div>
        <div className="content">
          <div>
            <b>Total waves: {allWaves.length}</b>
          </div>
          {allWaves.map((i) => {
            return (
              <div key={allWaves.indexOf(i)}>
                On {i.timestamp},<b> address </b>
                {i.address} <b>said:</b> {i.message}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
