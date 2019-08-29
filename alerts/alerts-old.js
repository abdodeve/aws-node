const AWS = require('aws-sdk');

AWS.config.update({
	region: 'us-west-2'
});

exports.handler = (event, context, callback) => {
	try {
		writeSinglePostToDB(event).then(() => {
			const response = {
				statusCode: 200,
				body: JSON.stringify({
					message: `The blog post was successfuly written to the db`
				})
			};
			callback(null, response);
		});
	} catch (err) {
		callback('error', 'Error : ' + err);
	}
};

function writeSinglePostToDB(post) {
	return new Promise((resolve, reject) => {
		var docClient = new AWS.DynamoDB.DocumentClient();

		var table = 'posts';

		var { id, title, published, tags, content, image_id, categories, geo_country, geo_county } = post;

		var params = {
			TableName: table,
			Item: {
				id,
				title,
				published,
				tags,
				content,
				image_id,
				categories,
				geo_country,
				geo_county
			}
		};

		docClient.put(params, function(err, data) {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
