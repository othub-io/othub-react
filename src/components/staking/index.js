import React, { useState } from "react";
import "../../css/home.css";
import "../../css/main.css";
import Stats from "./stats";

const Staking = () => {
  return (
    <div className="main">
      <div className="header">
        {/* <NetworkDrop network={setNetwork} blockchain={setBlockchain} /> */}
      </div>
      <div className="staking-body">
        <div className="about-title">About OTHub</div>
        <div className="about-text">
          OThub.io is a free, open-source community-driven web tool that
          democratizes access to the Origintrail Decentralized Knowledge Graph.
          Initially created in 2018 by a community member Luke, OThub has
          evolved significantly since the introduction of Origintrail DKG V6.
          The current OTHub team is comprised of four members - Dmitry, BRX,
          Cosmi, with Luke serving as an advisor with the support of Trace Labs'
          ChatDKG grant program. OTHub now supports a broader range of use cases
          than its predecessor, offering features like network statistics, asset
          catalogs, network analytics, knowledge asset publishing, and node
          operator insights. Additionally, OTHub provides a free developer API
          to encourage and support knowledge app development.
          <br />
          <br />
          OTHub actively operates Origintrail nodes across all supported testnet
          and mainnet networks, underpinning our web infrastructure. Our
          ambition is to become the preferred host for reliable community nodes,
          channeling rewards back into OTHub and its community. Additionally,
          the operator fee on nodes hosted by OTHub will be used to cover OTHub
          operating expenses as well as OTHub improvement PR rewards and funding
          the mainnet API. The OTHub team has committed many hours to create and
          maintain OTHub and our goal is to keep providing our services to the
          community for free.
        </div>
        <div className="nodes-title">Offical OTHub Nodes</div>
        <Stats
          data={[
            {
              network: "DKG Mainnet",
              blockchain: "",
            },
          ]}
        />
        <div className="delegate-button">
          <a
            href="https://dkg.origintrail.io/staking"
            target="_blank"
            rel="noreferrer"
          >
            Delegate
          </a>
        </div>
      </div>
    </div>
  );
};

export default Staking;
