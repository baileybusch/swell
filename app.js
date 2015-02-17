var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account
var stripe = require("stripe")("pk_test_5jkypj4J9HFYKz9TWiPEm2Y5");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
var stripeToken = request.body.stripeToken;

var charge = stripe.charges.create({
  amount: 1000, // amount in cents, again
  currency: "usd",
  card: stripeToken,
  description: "payinguser@example.com"
}, function(err, charge) {
  if (err && err.type === 'StripeCardError') {
    // The card has been declined
  }
});