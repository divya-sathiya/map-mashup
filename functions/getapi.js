exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: process.env.MAP_API_KEY,
  };
};
