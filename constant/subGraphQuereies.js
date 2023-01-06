import gql from 'graphql-tag'



const GET_ACTIVE_ITEMS = gql(`

  {
    activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
        id
        nftAddress
        seller
        buyer
        price
        tokenId
    }
}`   
)
export default GET_ACTIVE_ITEMS