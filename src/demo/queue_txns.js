const axios = require('axios');

const api_key = 'sxtX4CDKSI1ulij8HjPtl5B9UiYtPF'

const queue_txns = async (api_key) => {
    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/get?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/406325`
    //  )
    //console.log(`----------GET------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/getLatestStateIssuer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
    //  )
    //console.log(`----------GET LATEST STATE ISSUER------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/getOwner?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
    //  )
    //console.log(`----------GET OWNER------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/getStates?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828`
    //  )
    //console.log(`----------GET STATES------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/getStateIssuer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828&stateIndex=0`
    //  )
    //console.log(`----------GET STATE ISSUER------------`)
    //console.log(response.data)

    response = await axios.get(
        `http://localhost:5575/otp/dkg/create?api_key=${api_key}&network=otp::testnet&txn_data={
            "@type" : "CreativeWork",
            "name" : "Love letter to Luke",
            "text" : "Dear Luke, U r 2 cute."
}&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d`
    )
    console.log(`----------CREATE------------`)
    console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/update?api_key=${api_key}&network=otp::testnet&txn_data={"author":""}&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/356828        `
    //  )
    //console.log(`----------UPDATE------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/transfer?api_key=${api_key}&network=otp::testnet&ual=did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/406325&receiver=0x3E4c39228BfcBfB98EdbC1905A6C7716cD5303f2&public_address=0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d        `
    //  )
    //console.log(`----------TRANSFER------------`)
    //console.log(response.data)

    //response = await axios.get(
    //    `http://localhost:5575/otp/dkg/query?api_key=${api_key}&query=prefix schema: <https://schema.org/>select ?s ?modelName where {?s schema:model ?modelName}&network=otp::testnet`
    //  )
    //console.log(`----------QUERY------------`)
    //console.log(response.data)
}

queue_txns(api_key)