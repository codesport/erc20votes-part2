// source: https://wagmi.sh/react/guides/send-transaction#example
'use client'
import * as React from 'react'
// useSendTransaction and useWaitForTransactionReceipt Hooks, and BaseError handler
import { useSendTransaction, useWaitForTransactionReceipt, type BaseError, } from 'wagmi'
import { parseEther } from 'viem'


export function SendEthereum() {

    // useSendTransaction Hook with loading state 'isPending', and BaseError handler. NB 'hash must be first in list
    const { data: hash, error, isPending, sendTransaction } = useSendTransaction()

    // Form handler
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const to = formData.get('address') as `0x${string}`
        const value = formData.get('value') as string
        // useSendTransaction Hook 
        sendTransaction({ to, value: parseEther(value) })
    }

    // useWaitForTransactionReceipt Hook
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })


    return (
        // Form handler
        <form onSubmit={submit}>
            <input name="address" width="30" className='max-w-sm p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="To Wallet Address" required />

            <input name="value" className="w-sm p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Number of Tokens" required />

            {/*Add loading state: diabled and pending status*/}
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={isPending} type="submit">{isPending ? 'Confirming...' : 'Send'}</button>

            {/* useSendTransaction Hook */}
            {hash && <div>Transaction Hash: {hash}</div>}

            {/* useWaitForTransactionReceipt Hook */}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}

            {/* BaseError Handler */}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}