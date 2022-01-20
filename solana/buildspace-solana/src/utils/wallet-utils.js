/**
 * Verifies if the "solana" object exists in the window, which means that a wallet extension is installed on the
 * user's browser. Then, it will verify if the wallet is already connected to the app.
 * 
 * @returns {Promise<string>} public key of the wallet
 */
export const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;
    if (solana) {
      if (solana.isPhantom) {
        console.log('The user has a Phantom wallet!');

        /**
         * This code belows confirms if the app is authorized to access the user's wallet. If not, it will throw an error.
         * 
         * The onlyIfTrusted parameter will automatically pull the wallet's data without prompting them with another
         * connect popup if the user has already connected their wallet to the app before.
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        const publicKey = response.publicKey.toString();
        console.log('Connected with Public Key:', publicKey);
        return publicKey;
      }
    } else {
      alert('Could not find the Solana object in the Javascript window, please install the Phantom Wallet!');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Connects the app to the Solana wallet.
 * 
 * @returns {Promise<string>} public key of the wallet
 */
export const connectWallet = async () => {
  const { solana } = window;
  if (solana) {
    const response = await solana.connect();
    const publicKey = response.publicKey.toString();
    console.log('Connected with Public Key:', publicKey);
    return publicKey;
  }
}

/**
 * Sends the GIF data to Solana.
 * 
 * @param {string} url the URL to the GIF
 * @returns {Promise<boolean>} if successful
 */
export const sendGif = async (url) => {
  if (url.length > 0) {
    console.log('Gif link:', url);
    return true;
  } else {
    console.log('Empty input. Try again.');
  }
  return false;
};
