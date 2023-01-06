import { useEffect, useState } from "react"
import { Card, useNotification } from "web3uikit"
import Image from "next/image"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract, isWeb3Enabled } from "react-moralis"
import basicNftAbi from "../constant/basicNFTAbi.json"
import nftMarketAbi from "../constant/nftAbi.json"
import UpdateNftModal from "./UpdateNftModal"

function Nftcard({ items, nftMarketplaceAddress}) {
    const [image, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [description, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const { account, isWeb3Enabled } = useMoralis()
    const { seller, price, tokenId, nftAddress } = items
    const dispatch = useNotification()
    const nftOwner = seller === account

    // console.log('items', items)
    const truncateStr = (fullStr, strLen) => {
        if (fullStr.length <= strLen) return fullStr

        const separator = "..."
        const seperatorLength = separator.length
        const charsToShow = strLen - seperatorLength
        const frontChars = Math.ceil(charsToShow / 2)
        const backChars = Math.floor(charsToShow / 2)
        return (
            fullStr.substring(0, frontChars) +
            separator +
            fullStr.substring(fullStr.length - backChars)
        )
    }

    const accountAdsr = nftOwner ? "You" : truncateStr(seller || "", 15)

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "BuyItem",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const handleSuccess = (nftResponse) => {
        console.log("nftResponse", nftResponse)
        dispatch({
            type: "success",
            position: "topL",
            title: "Item Bought!",
            message: "Item bought successfully...",
        })
    }

    const updateUI = async () => {
        const tokenURI = await getTokenURI()
        // console.log('tokenURI', tokenURI)
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
    }

    useEffect(() => {
        updateUI()
    }, [])

    const handleClick = () => {
        console.log("clicked!")
        isWeb3Enabled
            ? nftOwner
                ? setShowModal(true)
                : buyItem({
                      onError: (e) => {
                          console.log("Error:", e)
                      },
                      onSuccess: (nft) => {
                          handleSuccess(nft)
                      },
                  })
            : null
    }

    const handleModal = () => {
        setShowModal(false)
    }



    return (
        //card and onclick events for update nft or buy nft
        <>
        {  showModal &&  <UpdateNftModal
                visible={showModal}
                onClose={handleModal}
                nftAddress={nftAddress}
                tokenId={tokenId}
                nftMarketplaceAddress={nftMarketplaceAddress}
            />}

            <div className="m-10 w-80 hover:animate-bounce hover:transition-all hover:duration-300 my-10">
                <Card
                    onClick={() => {
                        handleClick()
                    }}
                >
                    <p className="text-right">Own by {accountAdsr}</p>
                    <Image src={image} width="200" height="200" />
                    <p className="font-bold text-right">
                        {ethers.utils.formatUnits(price, "ether")} ETH
                    </p>
                    <p className="font-bold text-center">{tokenName}</p>
                    <p className="font-bold text-center">{description}</p>
                </Card>
            </div>
        </>
    )
}

export default Nftcard

//show address to be either own by you or the seller ✅

// to buy NTF ..⏱️
// to update NFT ..✅⏱️
// hover animation ✅⏱️
// sell nft ✅⏱️
