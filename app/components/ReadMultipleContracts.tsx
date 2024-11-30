// Source: https://wagmi.sh/react/guides/read-from-contract

'use client'

import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core'

import { formatEther, hexToString } from 'viem';
import { type BaseError, useReadContract, useReadContracts, useAccount } from 'wagmi'
import ballotABI_ from "../utils/TokenizedBallot.json";
import tokenABI_ from '../utils/VoteToken.json';
import { config } from '../config/wagmi';
import contractAddresses from '../utils/contract-data.json'

const tokenAddress = contractAddresses.tokenAddress as `0x${string}`
const ballotAddress = contractAddresses.ballotAddress

const tokenABI = tokenABI_.abi
const ballottABI = ballotABI_.abi

const HookForLoopRead = (index_proposal: number): unknown | undefined => {

    const { data: tempObject } = useReadContract({
        address: ballotAddress as `0x${string}`,
        abi: ballottABI,
        functionName: "proposals",
        args: [index_proposal]
    })
    // console.log('Index Inside Hook', index_proposal)
    // console.log('Temp Obj Inside Hook', tempObject)

    return tempObject


}

const HookForSnapshot = (address: unknown, blockNumberAtSnapshot: number): bigint | unknown => {

    const { data: tokensAtSnapshot } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenABI,
        functionName: 'getPastVotes',
        args: [address, blockNumberAtSnapshot]
    })
    // console.log('2nd Hooke Call', address, blockNumberAtSnapshot)
    // const tokensAtSnapshot = readContract(config, {
    //     address: tokenAddress as `0x${string}`,
    //     abi: tokenABI,
    //     functionName: 'getPastVotes',
    //     args: [address, blockNumberAtSnapshot]
    // })
    console.log('2nd Hooke Call', tokensAtSnapshot)
    return tokensAtSnapshot

}

const ReadMultipleContracts = () => {

    //const [proposals, setProposals] = useState([])

    const { address, isConnected } = useAccount();
    // const [tokensAtSnapshot2, setTokensAtSnapshot] = useState(0n)
    // const [blockNumberAtSnapshot2, setBlockNumberAtSnapshot2] = useState(0)

    const getBalance = {
        address: tokenAddress as `0x${string}`,
        abi: tokenABI,
        args: [address]
    }


    const getTokensAtSnapshot = {
        address: tokenAddress as `0x${string}`,
        abi: tokenABI,
        args: [address, 7065901]
    }

    const getSnapshotBlock = {
        address: ballotAddress as `0x${string}`,
        abi: ballottABI,
    }

    const getVotePowerFunction = {
        address: ballotAddress as `0x${string}`,
        abi: ballottABI,
        args: [address]
    }


    const { data, error, isPending } = useReadContracts({
        contracts: [
            { ...getBalance, functionName: 'balanceOf' },
            // { ...getTokensAtSnapshot, functionName: 'getPastVotes' },
            { ...getSnapshotBlock, functionName: 'targetBlockNumber' },
            { ...getVotePowerFunction, functionName: 'getVotePower' },
        ]
    });

    const [balance, /*tokensAtSnapshot,*/ blockNumberAtSnapshot, votingPower] = data || []

    const { data: tokensAtSnapshot } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenABI,
        functionName: 'getPastVotes',
        args: [address, blockNumberAtSnapshot?.result]
    }) as bigint | unknown

    const getVotingOutcome = () => {

        let index_proposal: number = 0
        // eslint-disable-next-line prefer-const
        let proposalArrOfObj: unknown[] = []//https://learnxinyminutes.com/docs/typescript/
        let tempObject: unknown | undefined

        for (index_proposal = 0; index_proposal < 3; index_proposal++) {
            try {
                tempObject = HookForLoopRead(index_proposal)

                // console.log("Proposal Outside Loop", tempObject);
                if (tempObject) {
                    // console.log("Proposal Inside Loop", proposalArrOfObj);
                    // console.log("Proposal Inside Loop", tempObject);
                    proposalArrOfObj.push({
                        name: hexToString(tempObject[0], { size: 32 }),
                        votesReceived: formatEther(tempObject[1]) //get rid of "n" big number notation. see: https://stackoverflow.com/a/53970656/946957
                    })
                    // index_proposal++
                }
            } catch (e) {
                console.log(e)
                //break;
            }
        }

        //Sorting and Array of JS Objects by a Specific Key: https://stackoverflow.com/a/979289/946957
        proposalArrOfObj.sort((a, b) => parseFloat(b.votesReceived) - parseFloat(a.votesReceived));

        const winningProposal = getWinner(ballotAddress as `0x${string}`)

        return [proposalArrOfObj, winningProposal]

    }

    const getWinner = (contractAddress: `0x${string}`) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data: winner } = useReadContract({
            address: contractAddress,
            abi: ballottABI,
            functionName: "winnerName",
        }) as unknown as `0x${string}`// any[] or as Address

        if (winner) {
            const name = hexToString(winner, { size: 32 });
            // console.log(`\n`)
            // console.log("  Winning proposal is:", name)
            // console.log(winner)

            return name;
        }
    }

    // const winningProposal = getWinner(ballotAddress as `0x${string}`)//getVotingData()
    const [proposalArrOfObj, winningProposal] = getVotingOutcome()

    // useEffect(() => {
    /*
    https://www.google.com/search?client=opera&q=why+does+react+render+variables+as+undefined+multiple+times+before+assigning+a+value

    https://www.google.com/search?q=why+does+react+render+variable+as+undefined+multiple+times+before+assigning+a+value

    https://ethereum.stackexchange.com/a/163941/3506
    https://www.youtube.com/watch?v=qdCHEUaFhBk
    https://www.google.com/search?q=how+to+use+useEffect+to+display+data+in+React+when+it+becomes+available
    https://www.google.com/search?q=React%3A+how+to+use+useEffect+to+show+data

    https://www.google.com/search?q=React%3A+use+a+value+in+another+function+only+when+when+data+arrives+from+another+function+call
    
    https://www.google.com/search?do+something+when+data+arrives
    */
    // }, []);


    if (isPending) return <div>Loading...</div>

    if (error)
        return (
            <div>
                Error: {(error as BaseError).shortMessage || error.message}
            </div>
        )

    return (
        <>
            {isConnected && (
                <>
                    <div><b>Your VTK Balance:</b> {(formatEther(balance?.result as bigint))}</div>
                    <div><b>Voting Power Remaining:</b> {(formatEther(votingPower?.result as bigint))}</div>
                    <div><b>Voting Power at Snapshot:</b> {tokensAtSnapshot && (formatEther(tokensAtSnapshot))}</div>
                    <div><b>blockNumberAtSnapshot:</b> {blockNumberAtSnapshot?.result as number}</div>
                    <h3 className='text-xl font-extrabold dark:text-white'>Voting Outcomes</h3>

                    {proposalArrOfObj.map((item, index) => (
                        <li key={index}>
                            {item.name}  Votes Received:  {item.votesReceived}
                        </li>
                    ))}

                    <div><b>Winning Proposal:</b> {winningProposal}</div>
                </>
            )
            }
        </>
    )


}
export default ReadMultipleContracts;