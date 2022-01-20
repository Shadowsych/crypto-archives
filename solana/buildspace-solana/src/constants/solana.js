import { web3 } from '@project-serum/anchor';
import { PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from '../idl.json';
import kp from '../keypair.json'

// Load up the key pair for the BaseAccount that is shared among all users
const secretKey = new Uint8Array(Object.values(kp._keypair.secretKey));
export const baseAccount = web3.Keypair.fromSecretKey(secretKey);

// Get our program's id from the IDL file
export const programId = new PublicKey(idl.metadata.address);

// Set our network to devnet
export const network = clusterApiUrl('devnet');

/**
 * Controls when to receive a confirmation for when our transaction has succeeded.
 * 
 * We have the power to decide when to acknowledge a transaction, so do we want to wait
 * for one validator node to acknowledge the transaction or wait for the whole blockchain?
 * 
 * In this case, we wait for our transaction to be confirmed by the node we're connected to.
 */
export const opts = {
  preflightCommitment: 'processed'
}
