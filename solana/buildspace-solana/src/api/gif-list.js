import { Program } from '@project-serum/anchor';
import { SystemProgram } from '@solana/web3.js';
import { baseAccount, programId } from '../constants/solana';
import { getProvider } from '../utils/solana-utils';
import idl from '../idl.json';

/**
 * Creates a GIF account for this user. Only call this if the BaseAccount has not been initialized for the user.
 */
export const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log('Created a new BaseAccount with address:', baseAccount.publicKey.toString());
    return getGifList();
  } catch (error) {
    console.error('Error creating BaseAccount account:', error);
  }
};

/**
 * Call Solana to receive the account that has the GIF links.
 * 
 * @returns {Promise<Array<string>>} an Array of GIF links
 */
export const getGifList = async () => {
  try {
    console.log('Fetching GIF list...');
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Loaded GIF account:", account);
    return account.gifList;
  } catch (error) {
    console.error('Error in getGiftList:', error);
  }
  return null;
}

/**
 * Sends the GIF data to Solana.
 * 
 * @param {string} url the URL to the GIF
 * @returns {Promise<boolean>} if successful
 */
export const sendGif = async (url) => {
  if (url.length === 0) {
    console.log('No gif link provided!');
    return;
  }

  try {
    console.log('Adding GIF link:', url);
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    await program.rpc.addGif(url, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      }
    });
    console.log('GIF sucessfully sent to program:', url);
    return true;
  } catch (error) {
    console.error('Error sending GIF:', error);
  }
  return false;
};