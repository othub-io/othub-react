# OTHub React

OTHub React is a community managed React frontend built to work in tandem with the [othub-runtime](https://github.com/othub-io/othub-runtime) and [otp-sync](https://github.com/othub-io/othub-runtime) repositories.

### OTHub React is:
- A full service web application that provides greater insight into the activity and health of the DKG;
- An easy-to-use interface that encourages Knowledge Asset ownership and creation without needing your own node;
- A tool tailored to node runners to monitor node performance

### Timeline
- Q3 2023 - Core and basic implementation for all critical web pages, including crucial charts and mobile support
- Q4 2023 - Advanced charts and reports on overall network activity, personal node runner dashboard and basic Knowledge Asset publishing through [OTHub](othub.io)
- Q1 2024 - Further enhancement of data insights via improved charts, improved dashboards and additional features, such as bulk upload and new templates for data upload
- Q2 2024 - OTHub UI improvements and overhaul and Knowledge Asset catalog
- Q3 2024 - Further UI improvement with Node Operator DKG Voting (experimental)
- Q4 2024+ - Transition to a more stability focused approach with improved code performance. 

### Expected Impact
OTHub React is the frontend of [OTHub](othub.io). With the right UX, the othub-react repository could be a streamline channel to get new and experienced web3 enthusiasts into the world of verifiable Knowledge Assets.

### Instructions
> **Warning**
> 
> Please be aware that the instructions below are for users with the othub-runtime running on the configured port. othub-runtime will have its own requirements as well. 

Set up your working environment
```
git clone https://github.com/othub-io/othub-react
cd othub-react
cp .example-env .env
npm install
```
Below is the list of essential parameters:

| Params            | Description                                |
|-------------------|-------------------------------------------|
| PORT              | The port the react frontend will be available on. |
| SSL_KEY_FILE             | The Private Key file for SSL.                            |
| SSL_CRT_FILE           | The certificate file for SSL.                              |
| REACT_APP_RUNTIME_HOST       | The IP:PORT or DNS name for the othub-runtime service.                 |
| REACT_APP_RUNTIME_HTTPS            | True or False whether you are using SSL to communicate with runtime.             |
| REACT_APP_MINIMUM_ASK            | The minimum ask of the Alliance. Depreciating with Voting.            |

Copy the service file and start the react frontend
```
cp ~/othub-bot/othub-react.service /etc/systemd/system/
systemctl daemon-reload
systemctl start othub-react
systemctl enable othub-react
```
