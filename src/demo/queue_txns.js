const axios = require('axios');

const api_key = 'D3zAFE7pSAWeC02EH4a9NLwx8dLNKG'

const queue_txns = async (api_key) => {
  //  response = await axios.get(
  //      `http://localhost:5575/dkg/get?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/406325`
  //    )
  //  console.log(`----------GET------------`)
  //  console.log(response.data)

  //  response = await axios.get(
  //      `http://localhost:5575/dkg/getLatestStateIssuer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
  //    )
  //  console.log(`----------GET LATEST STATE ISSUER------------`)
  //  console.log(response.data)

  //  response = await axios.get(
  //      `http://localhost:5575/dkg/getOwner?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
  //    )
  //  console.log(`----------GET OWNER------------`)
  //  console.log(response.data)

//    response = await axios.get(
//        `http://localhost:5575/dkg/getStates?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
//      )
//    console.log(`----------GET STATES------------`)
//    console.log(response.data)

//    response = await axios.get(
//        `http://localhost:5575/dkg/getStateIssuer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828&stateIndex=0`
//      )
//    console.log(`----------GET STATE ISSUER------------`)
//    console.log(response.data)

   response = await axios.get(
       `http://api.othub.io/dkg/create?api_key=${api_key}&network=otp::testnet&txn_data={
          "@type": "Thing",
           "name" : "color"
}&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d`
   )
   console.log(`----------CREATE------------`)
   console.log(response.data)

  //  response = await axios.get(
  //      `http://api.othub.io/dkg/update?api_key=${api_key}&network=otp::mainnet&txn_data={
  //       "@type": "ImageObject",
  //        "name" : "OTHub 1M Assets Badge",
  //        "author":"OTHub.io",
  //        "caption" : "1 Million Assets!",
  //        "contentUrl" : "https://runtime.othub.io/images?src=OTHub-1M-Badge.jpg",
  //        "datePublished": "2023-09-23",
  //        "description": "A badge celebrating the achievement of 1 million assets on the Origintrail Decentralized Knowledge Graph",
  //        "encodingFormat": "image/jpeg",
  //        "belongsTo" : ["did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/1000000"],
  //        "ipfs" : {"type" : "string", "pattern" : "QmR17tQLVXvbEpPsBqee8NSB7T6fCZ7LPorGrjuzNyJ4nQ"}
  //       }&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d&ual=did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/1004951`
  //    )
  //  console.log(`----------UPDATE------------`)
  //  console.log(response.data)

    // response = await axios.get(
    //     `http://localhost:5575/dkg/transfer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/427135&receiver=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d`
    //   )
    // console.log(`----------TRANSFER------------`)
    // console.log(response.data)

    // response = await axios.get(
    //    `http://localhost:5575/dkg/query?api_key=${api_key}&query=prefix schema: <https://schema.org/>select ?s ?modelName where {?s schema:model ?modelName}&network=otp::testnet`
    //  )
    // console.log(`----------QUERY------------`)
    // console.log(response.data)

    // response = await axios.get(
    //    `http://localhost:5575/dkg/create_n_transfer?api_key=${api_key}&network=otp::testnet&txn_data={"color":"green"}&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d`
    //  )
    // console.log(`----------CREATE N TRANSFER------------`)
    // console.log(response.data)

    // response = await axios.get(
    //   `http://localhost:5575/otp_testnet/assetInventory?api_key=${api_key}&owner=0x974e658A243a5Ec0cE1a0a4317D42f48dBB05Fbd`
    // )
    // console.log(`----------INVENTORY------------`)
    // console.log(response.data)

    // response = await axios.get(
    //   `http://localhost:5575/otp_testnet/assetHistory?api_key=${api_key}&ual=did:dkg:otp/0x5cAC41237127F94c2D21dAe0b14bFeFa99880630/619273`
    // )
    // console.log(`----------HISTORY------------`)
    // console.log(response.data)
  }

queue_txns(api_key)