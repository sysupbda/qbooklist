# gbooklist

Manage your personal book list using this API.
Just register your account and bulk import your books with the PUT /books interface.
Alternatively load your books from https://www.googleapis.com/books/v1/volumes?q=Quantum%20Ph when setting the source to google in the bulk import.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need typescript and yarn to run the commands mentioned below.

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
git clone https://github.com/sysupbda/gbooklist.git
cd gbooklist
yarn install
```

To get started, 

```
yarn start
```

Check out http://localhost:3000/static/index.html
And note that while the authentification methodology has part of the token as the cookie secret, and this is mandatory for books operations, swaggerui cannot deal with it. You can just set any value in the secret and set testingdemoforshow as a token. This is configured and can be disabled in the configuration.

## Running the tests

```
yarn test
```

## Deployment

When deploying, please make sure the server is behind a ssl termination proxy or load balancer. Otherwise the secret cookie will not be sent back to the server as it is set as secure.
As there is no query rate limiting, this project is currently not usable in production.

Also, you probably don't want to deploy the static directory contents used to deliver swaggerui. Instead deploy that separately on a static file http server.

## Authors

* **Behrang Dadsetan** - *Initial work* - [PurpleBooth](https://github.com/sysupbda)

## License

This project is licensed under the MIT License.
