let AWS;
try {
    AWS = require('aws-sdk');
    console.log('Successfully loaded aws-sdk');
} catch (error) {
    console.error('Failed to load aws-sdk:', error);
    throw error;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const term = event.pathParameters?.term;

    if (httpMethod === 'GET') {
        if (!term) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing term in request' }),
            };
        }
        console.log('Term received:', term);
        const params = {
            TableName: 'DictionaryTable-dev',
            Key: { term: String(term) },
        };
        try {
            const data = await dynamoDB.get(params).promise();
            if (!data.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Term not found' }),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify(data.Item),
            };
        } catch (error) {
            console.log('DynamoDB Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error querying DynamoDB', error: error.message }),
            };
        }
    } else if (httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const newTerm = body.term;
        const definition = body.definition;
        if (!newTerm || !definition) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing term or definition in request body' }),
            };
        }
        const params = {
            TableName: 'DictionaryTable-dev',
            Item: { term: String(newTerm), definition: String(definition) },
        };
        try {
            await dynamoDB.put(params).promise();
            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'Term added successfully', term: newTerm }),
            };
        } catch (error) {
            console.log('DynamoDB Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error adding term to DynamoDB', error: error.message }),
            };
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Unsupported HTTP method' }),
    };
};