function createLambdaResponse(statusCode: number, data: any) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(data),
  };
}

export default createLambdaResponse;