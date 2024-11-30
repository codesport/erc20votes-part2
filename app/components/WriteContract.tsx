// Source: https://wagmi.sh/react/guides/write-to-contract

'use client'

import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi'
import ballotABI from "../utils/TokenizedBallot.json";
import tokenABI from '../utils/VoteToken.json';
import { formatEther, parseEther } from 'viem';

import contractAddresses from '../utils/contract-data.json'
//import { useTransactionCount } from 'wagmi'
//import { simulateContract, getTransactionCount } from '@wagmi/core'
//import { config } from '../config/wagmi';

export function WriteContract() {

    const { address, isConnected } = useAccount();
    const tokenAddress = contractAddresses.tokenAddress
    const ballotAddress = contractAddresses.ballotAddress

    const voteTokenABI = tokenABI.abi
    const tokenizedBallotABI = ballotABI.abi

    const { data: hash, error, isPending, writeContract } = useWriteContract()

    // const { data: transactionCount } = useTransactionCount({
    //     address: address,
    // })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const to = formData.get('address') as `0x${string}`
        const tokenQuantity = formData.get('tokenQuantity') as string


        // const { request } = await simulateContract(config, {
        //     abi: voteTokenABI,
        //     address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        //     functionName: 'mint',
        //     args: [to, parseEther(tokenQuantity)],
        //     nonce: transactionCount as number,
        // })
        // const hash = await writeContract(config, request)


        writeContract({
            address: tokenAddress as `0x${string}`,
            abi: voteTokenABI,
            functionName: 'mint',
            args: [to, parseEther(tokenQuantity)],
            //nonce: transactionCount as number
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <form onSubmit={submit}>
            <input name="address" width="30" className='max-w-sm p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="To Wallet Address" required />

            <input name="tokenQuantity" className="w-sm p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of Tokens to Mint" required />

            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Mint'}
            </button>

            {/* useSendTransaction Hook */}
            {hash && <div>Transaction Hash: {hash}</div>}

            {/* useWaitForTransactionReceipt Hook */}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}

            {/* BaseError Handler */}
            {
                error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )
            }
        </form >
    )
}