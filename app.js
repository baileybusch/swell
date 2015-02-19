// variable declarations
var fs         = require('fs'),
	http       = require('http'),
	express    = require('express'),
	bodyParser = require('body-parser'),
	request    = require('request'),
	app        = express(),
	server     = http.createServer(app),
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://dashboard.stripe.com/account
	stripe     = require("stripe")("");

// for one time payments:
function chargeCard(token, res){
	stripe.charges.create({
		amount: 1000, // amount to charge in cents
		currency: 'usd',
		card: token, //the token from the client
		description: 'Test charge from ' + (new Date()),
	}, function(err, charge) {
		if (err) {
			res.send({ok: false, message: 'There was a problem processing your card (error: ' + JSON.stringify(err) + ')'});
		} else {
			res.send({ok: true, message: 'Your transaction completed!'})
		}
	});
} 

// server listen to port 8000 and run express configuration
app.listen(8000);
console.log("server running on localhost:8000");
app.use(bodyParser.json()); // lets us parse JSON from POST requests
app.disable('x-powered-by'); // this stops Express from broadcasting that you're using Express, which is always good practice
app.use(bodyParser.urlencoded({ extended: false }))


// server handle first client request
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/index.html'); //send the payment form file
});

// server handle request to '/charge' 
app.post('/charge', function (request, response) {
	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form
	var stripeToken = request.body.stripeToken;
	var stripeEmail = request.body.stripeEmail;

	console.log(stripeToken);

	var charge = stripe.charges.create({
  		amount: 1000, // amount in cents, again
  		currency: "usd",
  		card: stripeToken,
  		customer: stripeEmail,
  		description: stripeEmail
	}, function(err, charge) {
  		if (err && err.type === 'StripeCardError') {
    	// The card has been declined
  		}
	});
	
	// handle unexpected missing input:
	if (!request.body || !request.body.stripeToken) return response.send({ok: false, message: 'error'});
	chargeCard(request.body.stripeToken, response);
	// alternatively, you could subscribeUser(request.body.token, response)
});
