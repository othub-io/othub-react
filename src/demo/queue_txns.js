const axios = require('axios');

const api_key = '6FCVZsJ4djazql4QUlaY3He7W13MvB'

 const queue_txns = async (api_key) => {
//    response = await axios.get(
//        `https://api.othub.io/dkg/get?api_key=${api_key}&network=otp::mainnet&ual=did:dkg:otp/0x5cAC41237127F94c2D21dAe0b14bFeFa99880630/1004951&state=LATEST&txn_description`
//      )
//    console.log(`----------GET------------`)
//    console.log(response.data)

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

//    response = await axios.post(
//        `http://api.othub.io/dkg/create?api_key=${api_key}&network=otp::mainnet&txn_data={
//           "@type": "Thing",
//            "name" : "color"
// }&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d`
//    )
//    console.log(`----------CREATE------------`)
//    console.log(response.data)

  //  response = await axios.post(
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

    // response = await axios.post(
    //    `https://api.othub.io/dkg/create?api_key=${api_key}&network=otp::testnet&txn_data={
    //     "@type": "MusicAlbum",
    //     "title": "Tangible Dream",
    //     "byArtist": {
    //       "@type": "Person",
    //       "name": "Oddisee",
    //       "@id": "https://en.wikipedia.org/wiki/Oddisee"
    //     },
    //     "track": {
    //       "@type": "ItemList",
    //       "numberOfItems": 13,
    //       "itemListElement": [
    //         {
    //           "@type": "ListItem",
    //           "position": 1,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Tangible Dream"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 2,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Yeezus Was a Mortal Man"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 3,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Killin' Time"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 4,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Own Appeal"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 5,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "The Goings On",
    //             "featuring": {
    //               "@type": "Person",
    //               "name": "Ralph Real"
    //             }
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 6,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Be There"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 7,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Yeah and Nah"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 8,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Interlude Flow"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 9,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Unfollow You",
    //             "featuring": {
    //               "@type": "Person",
    //               "name": "Olivier St. Louis"
    //             }
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 10,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Back of My Mind",
    //             "featuring": {
    //               "@type": "Person",
    //               "name": "Paolo Escobar"
    //             }
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 11,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Tomorrow Today"
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 12,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Outro Flow",
    //             "featuring": {
    //               "@type": "Person",
    //               "name": [
    //                 "Toine",
    //                 "Trek Life"
    //               ]
    //             }
    //           }
    //         },
    //         {
    //           "@type": "ListItem",
    //           "position": 13,
    //           "item": {
    //             "@type": "MusicRecording",
    //             "name": "Bonus Flow",
    //             "featuring": {
    //               "@type": "MusicGroup",
    //               "name": "Diamond District"
    //             }
    //           }
    //         }    
    //       ]
    //     }
    //   }&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/458155`
    //  )
    // console.log(`----------CREATE N TRANSFER------------`)
    // console.log(response.data)

    response = await axios.post(
      `http://localhost:5575/dkg/create_n_transfer?api_key=${api_key}&network=otp::testnet&txn_data={
       "@type": "Movie",
       "name": "The Prestige"
     }&public_address=0x7fc06aAb44c9Dcf441ADAcf757D0a4e9fCD8910E`
    )
   console.log(`----------CREATE N TRANSFER------------`)
   console.log(response.data)

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