# buildspace Solana GIF Portal Project
This is a project from buildspace for the [Build a Web3 app on Solana with React and Rust](https://app.buildspace.so/projects/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3).

Run `npm install` at the root of your directory  
Run `npm run start` to start the project

### Section 1 - Building a connect wallet button with Phantom Wallet
In order for the website to talk to Solana program, we need to connect our wallet to it. We can use the Phantom wallet extension to accomplish this. The phantom wallet will inject a ```solana``` object on the ```window``` in Javascript, which allows us to access solana functions.

In utils/wallet-utils.js, I have code that verifies that the ```window.solana``` object exists and that the wallet is authorized to access the user's wallet. If the user is not authorized to access the wallet, then we need to request the user to connect their wallet with a "Connect to Wallet" button defined in App.js.

Once the user is authorized, then the GIFs should start showing on the app!