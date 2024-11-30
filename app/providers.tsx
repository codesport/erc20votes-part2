'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
//https://www.rainbowkit.com/docs/theming#dark-mode-support
import { RainbowKitProvider, lightTheme, darkTheme, } from '@rainbow-me/rainbowkit';

import { config } from './config/wagmi';
import { sepolia } from 'wagmi/chains';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider initialChain={sepolia} modalSize="compact" theme={{
                    lightMode: lightTheme(),
                    darkMode: darkTheme(),
                }} > {children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider >
    );
}
