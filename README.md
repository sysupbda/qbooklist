# qbooklist

Manage your personal book list using this API.
Just register your account and bulk import your books with the PUT /books interface.
Alternatively load your books from https://www.googleapis.com/books/v1/volumes?q=Quantum%20Ph when setting the source to google in the bulk import.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need **git**, **typescript** and **yarn** to run the commands mentioned below.

### Installing

A step by step series of examples that tell you have to get a development env running


```
git clone git@github.com:sysupbda/qbooklist.git
cd qbooklist
yarn install
```

To get started, 

make sure your redis-server is running locally. Then:

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

## Features

### Authentification

The authentification is token based.

When you */login* or */register*, a token piece is set as a **httpOnly** cookie and another returned in the body of the response.

By default, the token is valid for one hour and is stored as a salted **sha256** hash.

All requests to */books* require the **cookie** *secret* and *token* as a query parameter. For clients unable to set the cookie (SwaggerUI for example). you can simply set the entire *token* as a query string.

### Book list API

Note all below queries require a valid **token**. Part of the token is provided in the **query string** with the parameter token. The other part by the cookie set with */register* and */login*

You can read the list of books of a user with `GET /books`. It also allows you to pass a query parameter to filter the results and offset/limit to paginate through results.
A specific book can be queried with `GET /books/:book`

You can add or update a book by using `POST /books` and provide the book in the body.

You can bulk upload books by using `PUT /books` and `{ "source": "list", "list": [...] }` as the body of the request.

You can also save books from the googleapi call https://www.googleapis.com/books/v1/volumes?q=Quantum%20Ph by using `PUT /books` and `{ "source": "google" }` as the body of the request.

## Authors

* **Behrang Dadsetan** - *Initial work* - [Ben](https://github.com/sysupbda)

## License

This project is licensed under the MIT License.
