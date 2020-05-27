# Ethic Score

**Problem:** Consumers have the power to support ethical companies, but do not have the time to research every company they buy from.

**Purpose:** This project is a composite scoring system for products and brands found on [Ethic Marketplace](https://www.ethicmarketplace.us/) that will allow consumers to more easily vet the products that they purchase. Our scoring system, in conjunction with Ethic Marketplace, will allow users to easily see how products stack up in regard to the things they care about.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
### Prerequisites/Installation

What things you need to install the software and how to install them

Ngrok is a cloud service that accepts traffic on a public address and relays that traffic through to the ngrok process running on your machine and then on to the local address specified. 

This is required to allow Shopify to embedd our app

```
npm install ngrok -g
```

### Development Setup

A step by step series of examples that tell you how to get a development env running

To start up the backend, run the express server

```
npm run express
```

If you're only planning to make changes to the backend, then that's it! Happy developing.
Continue with the following steps if you're planning to work on the Embedded App

On a new terminal, run the react server with the following command

```
npm run server
```

On another new terminal, create a tunnel on port 3000 with ngrok
```
ngrok http 3000
```

Next, log on to the Shopify Partners.

1. From your partner Dashboard, click Apps
2. Choose Ethic Score
3. From the top, click on App Setup
4. Copy the HTTPS version of the forwarding URL from your ngrok terminal tab.
5. Go to the URL section of the page and paste the HTTPS version of your ngrok forwarding URL into the App URL field.
6. Paste the same HTTPS forwarding URL into the Whitelisted redirection URL(s) field and add /auth/callback to the end of the path.
7. Save changes
8. Visit the app on the test development store and if you followed the steps, the embedded app should be up and running. 

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Example using Google Cloud App Engine

1. Create one App Engine for Embedded App and one for API
2. Set up Google Cloud to run in this directory

```
gcloud init
```

3. Change start script in package.json
  a. First deploy API server
  
  ```
  "start": "node index.js"
  ```
  
  b. Then run:
  ```
  gcloud app deploy
  ```
  
  c. Second deploy Embedded App
  ```
  "start": "next build && npm run client"
  ```
  
  d. Then run:
  ```
  gcloud app deploy
  ```

## Built With

### Frontend
* [React.js](https://reactjs.org/) - Frontend library 
* [Next.js](https://nextjs.org/) - React Framework
* [Liquid](https://shopify.github.io/liquid/) - Templating Language used on Shopify Stores
* [Polaris](https://polaris.shopify.com/) - Shopify Component Library for styling

### Backend
* [Node.js](https://nodejs.org/en/) - Javascript Runtime Environment
* [Express](https://expressjs.com/) - Web Application Framework

## Authors

* **Ivan Huang** - [younghuangbao](https://github.com/younghuangbao)
* **Nathan Cho** - [lopkik](https://github.com/lopkik)
* **Preston Tai** - [prestontai](https://github.com/prestontai)
* **Brandon Tom** - [brandontom96](https://github.com/brandontom96)
