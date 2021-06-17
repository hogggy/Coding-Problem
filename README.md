# Create Payments API

## Overview

As part of our app we need to accept payments from users. In order to do this we are going to create a simplified create
payments endpoint which does the following:
* Takes in data from the user
* Creates a payment with a payment processor client
* Saves a reference of the payment in the DB
* Returns a representation of the payment back to the user
* Handles any validation and error handling necessarry

## API Reference

Our API should take in the following fields as JSON.

- referenceId: A unique string id for this transaction used for idempotency
- amount: The amount of the payment, must be an integer

ex: 
```json
{
  "referenceId": "bacon",
  "amount": 10
}
```

It is up to you to define appropriate error responses.

## Payment Processor API

The payment processor API accepts the same data as above.

- referenceId: A unique string id for this transaction used for idempotency
- amount: The amount of the payment, must be an integer

It will respond with a 400 status code and json if there are any validation errors:

```json
{ "error": "referenceId is invalid" }
```

It can occasionally have catastrophic errors and return a 500 status code.
There is a simple client available in the payment-processor-client file.

## Database

The database is a simple mongo DB and is setup in the mongo.js file using mongoose.
