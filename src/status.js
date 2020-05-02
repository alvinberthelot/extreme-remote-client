exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: "status 👍",
      version: "1.0.1",
    }),
  })
}
