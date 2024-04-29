import { useEthers, useContractFunction } from '@usedapp/core'
import { constants, utils } from 'ethers'
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { Contract } from '@ethersproject/contracts'
import networkMapping from "../chain-info/deployments/map.json"
import React, { useEffect, useState } from "react"

export const useUnstakeTokens = (tokenAddress: string, amount: number | string | Array<number | string>) => {
    // Address, ABI, chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    // UnStake

    const { send: unstakeSend, state: unstakeState } =
        useContractFunction(tokenFarmContract, "unstakeTokens", {
            transactionName: "Unstake Tokens",
        })
    const unstake = (amount: string) => {
        return unstakeSend(tokenAddress, amount)
    }
    const [state, setState] = useState(unstakeState)

    //useEffect
    // useEffect(() => {
    //     unstakeSend(tokenAddress, amount)
    // }, [amount, tokenAddress])

    useEffect(() => {
        if (unstakeState.status === "Success") {
            setState(unstakeState)
        }
    }, [unstakeState])

    return { unstake, state }
}