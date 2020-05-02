const { uppercase } = require("./utils/text-utils")

exports.handler = (event, context, callback) => {
  // get parameters from the URL
  const parameters = event.queryStringParameters
  // build basic text with the parameter that should be in the URL
  const text = "Hello " + parameters.name
  // transform text with an external function
  const textToReturn = uppercase(text)
  // send response
  callback(null, {
    statusCode: 200,
    body: textToReturn,
  })
}
