const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Define allowed origins
  const allowedOrigins = [
    "https://dev.d4zhh6t9lhrmu.amplifyapp.com",
    "http://localhost:3000"
  ];

  // Get the origin from the request headers
  const origin = event.headers?.origin || event.headers?.Origin || '';

  // Set the Access-Control-Allow-Origin header to the matching origin, or default to production
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  // Define CORS headers
  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };

  try {
    // Log the event for debugging
    console.log("Event:", JSON.stringify(event, null, 2));

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({})
      };
    }

    // Handle GET request for /terms (list all terms)
    if (event.httpMethod === "GET" && (!event.pathParameters || !event.pathParameters.term)) {
      const params = {
        TableName: "DictionaryTable-dev",
      };
      const { Items } = await dynamoDB.scan(params).promise();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Items || [])
      };
    }

    // Handle GET request for /terms/{term} (retrieve a specific term)
    if (event.httpMethod === "GET" && event.pathParameters?.term) {
      const searchTerm = event.pathParameters.term;
      if (!searchTerm) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Term is required" })
        };
      }

      // Scan the table to find case-insensitive match
      const params = {
        TableName: "DictionaryTable-dev",
      };
      const { Items } = await dynamoDB.scan(params).promise();
      
      // Find the first term that matches case-insensitively
      const matchingItem = Items?.find(
        item => item.term.toLowerCase() === searchTerm.toLowerCase()
      );

      if (!matchingItem) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Term not found" })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(matchingItem)
      };
    }

    // Handle POST request for /terms (add a new term)
    if (event.httpMethod === "POST") {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Request body is required" })
        };
      }

      let body;
      try {
        body = JSON.parse(event.body);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Invalid request body format" })
        };
      }

      const { term, definition } = body;

      if (!term || !definition) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Term and definition are required" })
        };
      }

      // Check if term already exists (case-insensitive)
      const checkParams = {
        TableName: "DictionaryTable-dev",
      };
      
      const { Items } = await dynamoDB.scan(checkParams).promise();
      const existingTerm = Items?.find(
        item => item.term.toLowerCase() === term.toLowerCase()
      );
      
      if (existingTerm) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ 
            message: "Term already exists in the dictionary",
            term: existingTerm.term
          })
        };
      }

      const params = {
        TableName: "DictionaryTable-dev",
        Item: { term, definition }
      };
      await dynamoDB.put(params).promise();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Term added successfully", term })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Unsupported method" })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};