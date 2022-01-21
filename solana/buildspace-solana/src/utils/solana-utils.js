import { Connection } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { network, opts } from '../constants/solana';

/**
 * Creates a Solana provider, which is an authenticated connection to Solana.
 * 
 * @returns {Provider} solana provider
 */
export const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, window.solana, opts.preflightCommitment);
    return provider;
}
