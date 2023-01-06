import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Form, useNotification } from "web3uikit"
import networkMapping from "../constant/networkMappingAddress.json"
import nftAbi from "../constant/nftAbi.json"

function SellNft() {
    const [refresh, setRefresh] = useState(false)
    const [proceeds, setProceeds] = useState("0")

    const { chainId, account, isWeb3Enabled } = useMoralis()

    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const nftMarketplaceAddress = networkMapping[chainString]?.nftMarketplace[0]

    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    //////function to approve the nft
    const approveAndList = async (data) => {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveParams = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: nftMarketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveParams,
            onError: (error) => {
                console.log(error)
            },
            onSuccess: (tx) => handleListNft(tx, nftAddress, tokenId, price),
        })
    }

    //////////function to list the nft
    const handleListNft = async (tx, nftAddress, tokenId, price) => {
        console.log("Ok! Now time to list")
        await tx.wait()

        const listOptions = {
            abi: nftAbi,
            contractAddress: nftMarketplaceAddress,
            functionName: "ListNftsItems",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => {
                handleSuccess()
            },
            onError: (error) => {
                console.log("error", error)
            },
        })
    }

    ///// nft listed handle success notification
    const handleSuccess = () => {
        dispatch({
            title: "approved",
            type: "success",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = async () => {
        setRefresh(!refresh)
        dispatch({
            title: "p",
            type: "success",
            position: "topR",
        })
    }

    const getProcessFromChain = async () => {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftAbi,
                contractAddress: nftMarketplaceAddress,
                functionName: "getProceeds",
                params: {seller: account},
            },
            onError: (error) => {console.log(error)},
        })

        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        getProcessFromChain
    }, [proceeds, refresh, account, isWeb3Enabled])

    return (
        <div >
            <div className="w-5/12 p-10">
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
</div>
            <div className="mt-10">Withdraw {proceeds} proceeds</div>
            {proceeds != "0" ? (
                <Button
                    onClick={() => {
                        runContractFunction({
                            params: {
                                abi: nftAbi,
                                contractAddress: nftMarketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: () => handleWithdrawSuccess,
                        })
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>No proceeds detected</div>
            )}
        </div>
    )
}

export default SellNft
