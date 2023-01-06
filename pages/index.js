
import { useMoralis, useMoralisQuery } from "react-moralis"
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constant/subGraphQuereies"
import networkMapping from "../constant/networkMappingAddress.json"
import Nftcard from "../components/Nftcard"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)

    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const nftMarketplaceAddress = networkMapping[chainString]?.nftMarketplace[0]

    // console.log("nftMarketplaceAddress", nftMarketplaceAddress)
    // const ListedNFTs =  data?.activeItems
    // console.log('data', data)

    return (
        <>
            <div className="p-10">
                <h1 className="text-3xl font-bold ">Listed NFTs</h1>
                <div className="flex flex-wrap" >
                    {isWeb3Enabled ? (
                        loading || !data ? (
                            <div>
                                <p>loading...</p>
                            </div>
                        ) : (
                            data?.activeItems.map((items, index) => (
                                <Nftcard key={index} items={items} nftMarketplaceAddress={nftMarketplaceAddress} />
                            ))
                        )
                    ) : (
                        <div>
                            <p>Please connect your wallet</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
