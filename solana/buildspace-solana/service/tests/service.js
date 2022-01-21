const anchor = require('@project-serum/anchor');
const { SystemProgram } = require('@solana/web3.js');

const main = async () => {
  console.log('🚀 Starting test...');

  // Grab the local environment from the "solana config get" command
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  // Grab the Service code that Anchor compiled from lib.rs and deployed onto the local validator
  const program = anchor.workspace.Service;

  // Create an account keypair for our program to use to provide credentials for the BaseAccount we're creating
  const baseAccount = anchor.web3.Keypair.generate();

  // Call the start_stuff_off function defined in lib.rs with the context parameters
  const startStuffOffTx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [baseAccount],
  });
  console.log('📝 start_stuff_off transaction signature:', startStuffOffTx);

  // Fetch the total GIFs from the account
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  // Call the add_gif function defined in lib.rs with the context parameters
  const gifLink = 'insert_a_giphy_link_here';
  const addGifTx = await program.rpc.addGif(gifLink, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  console.log('📝 add_gif transaction signature:', addGifTx);

  // Now, fetch the total GIFs from the account and print the gif list
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());
  console.log('👀 GIF List', account.gifList);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
