import React, { useEffect, useState } from 'react';
import { checkIfWalletIsConnected, connectWallet } from './utils/wallet-utils';
import './App.css';
import { createGifAccount, getGifList, sendGif } from './api/gif-list';

const App = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Verify that a Solana wallet is already connected once this component mounts
  useEffect(() => {
    const onLoad = async () => {
      const publicKey = await checkIfWalletIsConnected();
      setWalletAddress(publicKey);
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Whenever the user connects to the app, load the GIF list
  useEffect(() => {
    if (walletAddress) {
      const loadGifList = async () => {
        const gifList = await getGifList();
        setGifList(gifList);
      };
      loadGifList();
    }
  }, [walletAddress]);

  const onConnectWallet = async () => {
    const publicKey = await connectWallet();
    setWalletAddress(publicKey);
  }

  // Renders a button for the app to connect to the wallet if it's not already connected
  const renderConnectToWallet = () => (
    <button className="cta-button connect-wallet-button" onClick={onConnectWallet}>
      Connect to Wallet
    </button>
  );

  const onSubmitGifForm = async (event) => {
    event.preventDefault();
    setInputValue('');
    const success = await sendGif(inputValue);
    if (success) {
      const gifList = await getGifList();
      setGifList(gifList);
    }
  }

  const onCreateGifAccount = async () => {
    await createGifAccount();
    const gifList = await getGifList();
    setGifList(gifList);
  }

  // Renders the GIFs if the wallet is connected to the app
  const renderConnectedContainer = () => {
    if (gifList === null) {
      // The account has not been initialized, so showcase a button to do a one-time initialization for the GIF program account
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={onCreateGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    }

    return (
      <div className="connected-container">
        <form onSubmit={onSubmitGifForm}>
          <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={event => setInputValue(event.target.value)} />
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>
        <div className="gif-grid">
          {gifList.map(item => (
            <div className="gif-item" key={item.gifLink}>
              <img src={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderConnectToWallet()}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
      <div className="footer-container" />
    </div>
  );
};

export default App;
