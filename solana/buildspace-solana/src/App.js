import React, { useEffect, useState } from 'react';
import { checkIfWalletIsConnected, connectWallet, sendGif } from './utils/wallet-utils';
import { TEST_GIFS } from './constants/tests';
import './App.css';

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

  // Whenever the user connects to the app, 
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana here...

      // Set state of GIFs
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  const onConnectWallet = async () => {
    const publicKey = await connectWallet();
    setWalletAddress(publicKey);
  }

  // Renders a button for the app to connect to the wallet if it's not already connected
  const renderConnectToWallet = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={onConnectWallet}
    >
      Connect to Wallet
    </button>
  );

  const onSubmitGifForm = async (event) => {
    event.preventDefault();
    const success = await sendGif(inputValue);
    if (success) {
      setGifList([...gifList, inputValue]);
      setInputValue('');
    }
  }

  // Renders the GIFs if the wallet is connected to the app
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form onSubmit={onSubmitGifForm}>
        <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={event => setInputValue(event.target.value)} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

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
