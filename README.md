# Ethic Score

**Problem:** Consumers have the power to support ethical companies, but do not have the time to research every company they buy from.

**Purpose:** This project is a composite scoring system for products and brands found on [Ethic Marketplace](https://www.ethicmarketplace.us/) that will allow consumers to more easily vet the products that they purchase. Our scoring system, in conjunction with Ethic Marketplace, will allow users to easily see how products stack up in regard to the things they care about.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
### Prerequisites/Installation

1. Clone the repo to get started. 
2. Run `npm install` to install all the package dependencies
3. Next, install Ngrok on your machine by running `npm install ngrok -g`

Ngrok is a cloud service that accepts traffic on a public address and relays that traffic through to the ngrok process running on your machine and then on to the local address specified. 

This is required to allow Shopify to embedd our app

### Development Setup

#### Backend 
To start up the backend alone, simply run the express server

```
npm run express
```
If you're only planning to make changes to the backend, then that's it! Happy developing.

#### Embedded App 
However, if you're planning to work on the Embedded App, Issue the following command to start up both the Backend and React Server

```
npm run dev
```

On another new terminal, create a tunnel on port 3000 with ngrok
```
ngrok http 3000
```

Next, log on to the [Shopify Partners](https://www.shopify.com/partners) with Ethic Marketplace's Collaborator account.

1. From your partner Dashboard, click Apps
2. Choose Ethic Score
3. From the top, click on App Setup
4. Copy the HTTPS version of the forwarding URL from your ngrok terminal tab.
5. Go to the URL section of the page and paste the HTTPS version of your ngrok forwarding URL into the App URL field.
6. Paste the same HTTPS forwarding URL into the Whitelisted redirection URL(s) field and add /auth/callback to the end of the path.
7. Save changes
8. Visit the app on the test development store and if you followed the steps, the embedded app should be up and running. 

> **We didn't realize this until after setting up for production. For production, the forwarding URL should be the deployed app URL. So as of now, if the forwarding URL is changed for local development purposes, then the live version of the embedded app won't be available to be used.**

> It might be beneficial to create an entirely new app on the Shopify Partner's dashboard and use those app keys for development

## Deployment

Example using Google Cloud App Engine

1. Create one App Engine for Embedded App and one for API
2. Set up Google Cloud to run in this directory

```
gcloud init
```

3. Change start script in package.json
4. First deploy API server
```
"start": "node index.js"
``` 
5. Then run:
```
gcloud app deploy
```
6. Second deploy Embedded App
```
"start": "next build && npm run client"
```
7. Then run:
```
gcloud app deploy
```
## Ethic Metrics/Calculation

Metafields consists of a namespace, key, value and an optional description. Namespaces helps us group different metafields together. Can be helpful later in the future if we need to store different types of metafields. 

#### Current convention for a product's metafields: 
- *key*: choose 1 of the following: ["co_im", "eco_f," "all_n", "an_ri", "labor"]
- *valueType*: "string" 
- *value*: A JSON stringified string of all the metrics 
- *namespace*: "ethic-metrics"

#### Current convention for User Metafields:
- **key**: choose 1 of the following: ["co_im", "eco_f," "all_n", "an_ri", "labor"]
- **valueType**: "integer" 
- **value**: an integer ranging from 1-10
- **namespace**: "userprefs"

#### Naming Conventions
- **co_im**: Community Impact
- **eco_f**: Eco-Friendly
- **all_n**: All Natural/Non-toxic
- **an_ri**: Animal Rights
- **labor**: Labor Rights

A description of all metrics and their range of values can be found [here](https://docs.google.com/document/d/1LXzjx3NL_nHgKynO35K9APYgpg5n20hfFfduNcqY5vA/edit?usp=sharing)

The current weight of each metric used for calculation can be found [here](https://docs.google.com/spreadsheets/d/1HNSkAHpQ-CtQsIbivSHS9whIdpQuowLyj6rjsAWmoGk/edit#gid=0)

## Built With

### Frontend
* [React.js](https://reactjs.org/) - Frontend library 
* [Next.js](https://nextjs.org/) - React Framework
* [Liquid](https://shopify.github.io/liquid/) - Templating Language used on Shopify Stores
* [Polaris](https://polaris.shopify.com/) - Shopify Component Library for styling

### Backend
* [Node.js](https://nodejs.org/en/) - Javascript Runtime Environment
* [Express](https://expressjs.com/) - Web Application Framework

## Project Update Notes
* 3/10/2020 - [Project Requirement Document](https://docs.google.com/document/d/1JFjLBBLm9yKrprHkP-3ic495K3CZOJm6MAN8k8H1Z68/edit?usp=sharing)
* 6/1/2020 - [UCI Dev Notes](https://docs.google.com/document/d/1xnWTuZslykBLVktodUSABQz9F9WFUNYVrISUsip4DKc/edit?usp=sharing)
* 6/4/2020 - [UCI Project Demo](https://youtu.be/_k-yVTR4frA)

## Authors

* **Ivan Huang** - [younghuangbao](https://github.com/younghuangbao)
* **Nathan Cho** - [lopkik](https://github.com/lopkik)
* **Preston Tai** - [prestontai](https://github.com/prestontai)
* **Brandon Tom** - [brandontom96](https://github.com/brandontom96)
