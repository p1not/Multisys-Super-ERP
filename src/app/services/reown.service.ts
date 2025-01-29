import { Injectable } from '@angular/core';
import { createAppKit } from '@reown/appkit';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin,mainnet, arbitrum, solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'

@Injectable({
  providedIn: 'root',
})
export class ReownService {
  private appKit: any;

  constructor() {
    const projectId = '3c64d0cefa3278772de56231cf3442a7'; 

    const metadata = {
      name: 'Multisys',
      description: 'Multisys Super ERP',
      url: 'https://multisys.sol', 
      icons: ['https://avatars.githubusercontent.com/u/179229932'],
    };

    const bitcoinAdapter = new BitcoinAdapter({
      projectId,
    });

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
    })
    

    this.appKit = createAppKit({
      adapters: [bitcoinAdapter, solanaWeb3JsAdapter],  //, new Ethers5Adapter()
      networks: [bitcoin, solana, solanaTestnet, solanaDevnet, mainnet, arbitrum],
      metadata,
      projectId,
      features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
        emailShowWallets: true,
      },
      allWallets: 'SHOW',
    });
  }

  openModal() {
    this.appKit.open();
  }

  openNetworkModal() {
    this.appKit.open({ view: 'Networks' });
  }
}
