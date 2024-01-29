const Staking = () => {
  return (
    <div className="main">
      <div className="header">
        {/* <NetworkDrop network={setNetwork} blockchain={setBlockchain} /> */}
      </div>
      <div className="staking-body">
    <div className="staking-about">
      <h1>About OTHub</h1>
      <p>
      OThub.io is a free, open-source community-driven web tool that democratizes access to the Origintrail Decentralized Knowledge Graph. Initially created in 2018 by a 
      community member Luke, OThub evolved significantly with the introduction of Origintrail DKG V6. The protocol overhaul led to the current version of OTHub, developed 
      collaboratively by the Origintrail community with the support of Trace Labs' grant program.
        <br/><br/>
        The current OTHub team comprises four members - Dmitry, BRX, Cosmi, with Luke serving as an advisor. This version of OTHub supports a broader range of use cases 
        than its predecessor, offering features like network statistics, asset catalogs, network analytics, knowledge asset publishing, and node operator insights. Additionally,
         OTHub provides a free developer API to encourage and support knowledge app development.
      </p>
      <h2>Operator Fee</h2>
      <p>
      A notable addition to the Origintrail ecosystem is the operator fee, introduced alongside delegated staking. In this system, Origintrail nodes stake TRAC tokens to secure 
      the Decentralized Knowledge Graph (DKG) and in return, they receive TRAC tokens. Delegated staking allows all community members to seamlessly participate in the knowledge 
      economy without having to run a node.  
        <br/><br/>
        OTHub actively operates Origintrail nodes across all supported testnet and mainnet networks, underpinning our web infrastructure. Our ambition is to become the preferred 
        host for reliable community nodes, channeling rewards back into OTHub and its community. The OTHub maintainers have committed 10% (10,000 TRAC) of their grant funds to 
        initiate Gnosis node delegation. Additionally, the operator fee on nodes hosted by OTHub will be used to cover OTHub operating expenses as well as OTHub improvement PR rewards and funding the mainnet API. The OTHub team has 
        committed many hours to create and maintain OTHub and our goal is to keep providing our services to the community for free.
      </p>
      <br></br>
      <button>Delegate</button>
    </div>
    <div className="staking-node-list">
      <div className="othub-wallets">
        <h2>OTHub Wallets</h2>
        <h3>EVM</h3>
        <ul>
          <li><b>Management:</b><br></br>  <a href="https://gnosisscan.io/address/0xec654cbFd1CA5fF00466dEFb5DcD7fF519aEEE33" target="_blank" rel="noreferrer">0xec654cbFd1CA5fF00466dEFb5DcD7fF519aEEE33</a></li>
          <br></br>
          <li><b>OTHub Operational:</b><br></br> <a href="https://gnosisscan.io/address/0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d" target="_blank" rel="noreferrer">0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d</a></li>
        </ul>
        <h3>Substrate: </h3>
        <ul>
          <li><b>Management:</b><br></br> <a href="https://neuroweb.subscan.io/account/gJrTCGAjVWtjktKaH7dDDKd8APfwb4NXtoHrwEsTW8r2N6Vwb" target="_blank" rel="noreferrer">gJrTCGAjVWtjktKaH7dDDKd8APfwb4NXtoHrwEsTW8r2N6Vwb</a></li>
          <br></br>
          <li><b>OTHub Operational:</b><br></br> <a href="https://neuroweb.subscan.io/account/gJqhDSLh9uDqNP36YP6mXNqTquxL9tC9PmpzSmPYnj6DtmtyJ" target="_blank" rel="noreferrer">gJqhDSLh9uDqNP36YP6mXNqTquxL9tC9PmpzSmPYnj6DtmtyJ</a></li>
        </ul>
      </div>
    </div>
  </div>
    </div>
  );
};

export default Staking;
