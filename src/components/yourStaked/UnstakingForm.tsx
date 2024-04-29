import { Token } from "../Main"
import { useEthers, useNotifications, useContractFunction } from '@usedapp/core'
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useEffect, useState } from "react"
import { useUnstakeTokens } from "../../hooks/useUnstakeTokens"
import { utils, constants } from 'ethers'
import { useStakedTokenBalance } from "../../hooks/useStakedTokenBalance"

export interface StakeFormProps {
    token: Token
}

export const UnstakingForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { account } = useEthers()
    const user = account ? account.toString() : constants.AddressZero
    const tokenBalance = useStakedTokenBalance(tokenAddress, user)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const { notifications } = useNotifications()


    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { unstake, state: unstakeState } = useUnstakeTokens(tokenAddress, amount)

    const handleUnstakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return unstake(amountAsWei.toString())
    }

    const isMining = unstakeState.status === "Mining"
    const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowUnstakeTokenSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName == "Unstake Tokens").length > 0) {
            setShowUnstakeTokenSuccess(true)
            console.log("Unstaked!")
        }
    }, [notifications, showUnstakeTokenSuccess])

    return (
        <>
            <div>
                <Input
                    onChange={handleInputChange} />
                <Button
                    onClick={handleUnstakeSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "WITHDRAW"}
                </Button>
            </div>
            <Snackbar
                open={showUnstakeTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Unstaked! Your funds will return to your wallet shortly
                </Alert>
            </Snackbar>
        </>
    )
}