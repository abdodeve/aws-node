'use strict';

module.exports.get = async (event) => {
	try {
		getUser(event).then(() => {
			return {
				statusCode: 200,
				body: JSON.stringify(
					{
						message: 'User data successfully fetched !',
						input: event
					},
					null,
					2
				)
			};
		});
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: err }, null, 2)
		};
	}
};

function getUser(user) {
	return new Promise((resolve, reject) => {
		var docClient = new AWS.DynamoDB.DocumentClient();

		let { email } = user;
		params = {
			TableName: 'users',
			Key: {
				email
			}
		};

		docClient.get(params, function(err, data) {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
