const AWS = require('aws-sdk');


exports.handler = async (event, context, callback) => {


	console.log('got in the function')
		writeSinglePostToDB().then(() => {
			console.log( 'success' );
			const response = {
				statusCode: 200,
				body: JSON.stringify('Hello from Lambda!'),
			};
			callback(null, response);
		}).catch( (error)=> { console.log( error ); } );

		// promise1.then(function(value) {
		// 	const response = {
		// 		statusCode: 200,
		// 		body: JSON.stringify('Hello from Lambda!'),
		// 	};
		// 	return response;
		// });

    // console.log("Adev works");
    // // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
};


const simplePromise = async () => {
		console.log("hi");
}

function writeSinglePostToDB() {
  return new Promise((resolve, reject) => {
	  console.log('writing to db')
    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "Users";
    var params = {
      TableName: table,
      Item: {
		email: 'asdsadsadsad',
		name: 'dsadsadw'
      }
    };
	docClient.put(params, function(err, data) {
		console.log('erros', err, {'data': data});
      if (err) {
		  console.log('Promise rejected')
        reject();
      } else {
		console.log('Promise resolved')
        resolve();
      }
    });
  });
}

