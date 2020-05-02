exports.handler = (event, context, callback) => {
  const parameters = event.queryStringParameters
  callback(null, {
    statusCode: 200,
    body: "Hello " + parameters.name,
  })
}
