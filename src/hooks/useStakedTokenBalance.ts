import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { Contract } from '@ethersproject/contracts'
import { useCall, useEthers } from '@usedapp/core'
import { utils, constants } from 'ethers'
import networkMapping from "../chain-info/deployments/map.json"

export const useStakedTokenBalance = (tokenAddress: string, user: string) => {
    const { abi } = TokenFarm
    const { chainId } = useEthers()
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const { value, error } =
        useCall(
            user &&
            tokenAddress && {
                contract: new Contract(tokenFarmAddress, tokenFarmInterface),
                method: "stakingBalance",
                args: [tokenAddress, user],
            }
        ) ?? {};
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}