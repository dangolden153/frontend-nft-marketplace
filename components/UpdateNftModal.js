import { ethers } from "ethers"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal,  useNotification, Input} from "web3uikit"
import nftMarketAbi from '../constant/nftAbi.json'

function UpdateNftModal({ visible, onClose, nftAddress, tokenId, nftMarketplaceAddress }) {
    const [updatePrice, setUpdatePrice] = useState(0)
    const dispatch = useNotification()


    const handleUpdateListingSuccess = () => {
         dispatch({
            type:'success',
            position:"topL",
            title:"Item updated!",
            message:"Item updated successfully...",
          })
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "UpadteItem",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(updatePrice || "0")
        },
    })

    return (
        <Modal
        isVisible={visible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleUpdateListingSuccess(),
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setUpdatePrice(event.target.value)
                }}
            />
        </Modal>
    )
}

export default UpdateNftModal
