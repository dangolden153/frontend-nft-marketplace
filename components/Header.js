import Link from "next/link"
import React from "react"
import { ConnectButton } from "web3uikit"

function Header() {
    return (
        <div className="flex flex-row justify-between p-10">
            <h2>NFT Marketplace</h2>
            <div className="flex flex-row justify-center items-center">
                <Link href="/" className="mr-5">
                Home
                </Link>
                <Link href="/sell-nft">
                Sell NFT
                </Link>
                <div className="ml-5" />
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

export default Header
