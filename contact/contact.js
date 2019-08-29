const AWS = require('aws-sdk');
exports.handler = function(event, context) {
	AWS.config.update({ region: 'us-east-1' });
	// if (!customerEmail.match(/^[^@]+@[^@]+$/)) {
	//  console.log('Not sending: invalid email address', event);
	//  context.done(null, 'Failed');
	//  return;
	// }

	// Getting data from event object
	var { customerEmail, ticketMessage, serviceID } = event;

	//  This variable will contain the email of the concerned service
	var serviceEmail = '';

	//  Assigning an email based on the chosen service
	switch (serviceID) {
		case 1:
			serviceEmail = 'service1@email.com';
			break;
		case 2:
			serviceEmail = 'service2@email.com';
			break;
	}

	const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hey there,</p>
        <p>A customer sent a request with the following content: \n</p>
        <p>${ticketMessage}</p>
        <p>Please reply to his email : <a href="mailto:${customerEmail}"> ${customerEmail} </p>
      </body>
    </html>
  `;

	// Create sendEmail params
	const params = {
		Destination: {
			ToAddresses: [ serviceEmail ]
		},
		Message: {
			//  The email's body
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: htmlBody
				}
			},
			//  The email's subject
			Subject: {
				Charset: 'UTF-8',
				Data: 'New customer ticket!'
			}
		},

		//  The sender's name and email (must verified on SES)
		Source: 'Skytrend Ticket dispatcher <mfracso@skytrend.ma>'
	};

	// Create the promise and SES service object
	const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

	// Handle promise's fulfilled/rejected states
	sendPromise
		.then((data) => {
			context.done(null, 'Success');
		})
		.catch((err) => {
			context.done(null, 'Failed');
		});
};
