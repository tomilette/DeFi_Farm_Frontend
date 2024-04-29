import { Token } from "../Main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../BalanceMsg"
import { useCoingeckoPrice } from '@usedapp/coingecko'

export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name, priceName } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const tokenPrice = useCoingeckoPrice(priceName)
    let value = tokenBalance && tokenPrice ? formattedTokenBalance * Number(tokenPrice) : 0
    value = Math.round(value * 100) / 100
    return (<BalanceMsg
        label={`Your un-staked ${name} balance`}
        amount={formattedTokenBalance}
        tokenImgSrc={image}
        value={value} />)
}