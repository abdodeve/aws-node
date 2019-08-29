const AWS = require('aws-sdk');

AWS.config.update({
	region: 'us-east-1'
});

/*
    This function gets all the documents existing on the faq's dynamodb table
    and returns them as JSON
*/
exports.handler = async (event, context, callback) => {
	//  Instanciating the dynamodb docclient
	var docClient = new AWS.DynamoDB.DocumentClient();

	//  Selecting the right dynamodb table
	const params = {
		TableName: 'faq'
	};

	//  The array that will contain the whole data that we will return
	let scanResults = [];
	//  This variable will contain 1 MB of data as a maximum (read the next comment)
	let items;

	/*  This block allows us to iterate through each document of the selected table
      This was created in a form of a loop since dynamobdb scan function returns 1 MB
      of JSON data as a maximum in each request, so if the table size exceeds 1 MB
      and if we don't execute a similar procedure, we'll only get the first 1 MB
      of data resulting in a significant loss of data
    */
	do {
		//  Requesting data from the table
		items = await docClient.scan(params).promise();

		//  Putting each document in the global array
		items.Items.forEach((item) => scanResults.push(item));

		//  Setting the beginning index for the next iteration
		params.ExclusiveStartKey = items.LastEvaluatedKey;

		//  If we haven't reached the last document, continue
	} while (typeof items.LastEvaluatedKey != 'undefined');

	//  Formatting the JSON response
	var response = {
		statusCode: 200,
		body: JSON.stringify(scanResults)
	};

	//  Returning the response
	callback(null, response);
};
