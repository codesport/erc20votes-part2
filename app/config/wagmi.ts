import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
//import { injectedWallet, metaMaskWallet, rabbyWallet, safeWallet } from '@rainbow-me/rainbowkit/wallets';
import {
    baseSepolia, optimismSepolia, sepolia
} from 'wagmi/chains';
import { http } from 'wagmi'

// https://www.rainbowkit.com/docs/custom-wallet-list
// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [injectedWallet],
//     },
//   ]

// )

// const config = createConfig({
//   connectors,
//   {/* Wagmi config */}
// })

export const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'YOUR_PROJECT_ID',
    chains: [
        baseSepolia, optimismSepolia, sepolia,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    transports: {
        [baseSepolia.id]: http(process.env.BASE_SEPOLIA_RPC_URL_1),
        [optimismSepolia.id]: http(process.env.OPT_SEPOLIA_RPC_URL_1),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL_2),

    },
    ssr: true,
});
