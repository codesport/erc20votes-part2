'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';


// account.tsx: https://wagmi.sh/react/guides/connect-wallet#_4-display-connected-account
import { useAccount, useConnect, useDisconnect } from 'wagmi'
// import TokenizedBallot from './components/TokenizedBallot'
import { SendEthereum } from './components/SendEthereum'
import { WriteContract } from './components/WriteContract'
import ReadMultipleContracts from './components/ReadMultipleContracts';


function Page() {
    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const { disconnect } = useDisconnect()


    return (

        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: 12,
                }}
            >
                <ConnectButton />
            </div>

            <div>
                <h2 className='text-2xl font-extrabold dark:text-white'>Account</h2>

                <div>
                    {/* https://wagmi.sh/core/api/actions/getAccount#status */}
                    status: {account.status}
                    <br />
                    addresses: {JSON.stringify(account.addresses)}
                    <br />
                    chainId: {account.chainId}
                </div>

                {/*  account.tsx: https://wagmi.sh/react/guides/connect-wallet#_4-display-connected-account */}
                {/* {account.status === 'connected' && (
                    <button type="button" onClick={() => disconnect()}>
                        Disconnect
                    </button>
                )} */}
            </div>

            {/*   <div>
                walletOptions.tsx: https://wagmi.sh/react/guides/connect-wallet#_3-display-wallet-options 
                <h2 className='text-2xl font-extrabold dark:text-white'>Connect</h2>
                {connectors.map((connector) => (
                    <button
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        type="button"
                    >
                        {connector.name}
                    </button>
                ))}
                <div>{status}</div>
                <div>{error?.message}</div>
            </div>*/}

            <div>
                <h2 className='text-2xl font-extrabold dark:text-white'>Send ETH</h2>
                <SendEthereum />
            </div>

            <div>
                <h2 className='text-2xl font-extrabold dark:text-white'>Mint Voting Token</h2>
                <WriteContract />
            </div>

            <div>
                <h2 className='text-2xl font-extrabold dark:text-white'>Query Contract</h2>
                <ReadMultipleContracts />
            </div>

            <div>
                {/* <TokenizedBallot /> */}
            </div>


        </>




    );
}

export default Page;
