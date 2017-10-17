/**
 * niceErrors module.
 * @module niceErrors
 */
var Boom = require("boom");

/** Creates a boom compatiable bad request with optional errorData and statusCode
 *  @param {string} message Message for the end user
 *  @param {object} errorData Object that is returned to the end user (only logged in prod, not sent to end user.)
 *  @param {number} statusCode returned to web browser 
 */
module.exports =
 function(message, errorData, statusCode) {
  var error = Boom.badRequest(message);
  
  if (statusCode) {
    error.output.statusCode = statusCode;
  } else {
    error.output.statusCode = 400;
  }

  error.reformat();
  
  var errorText = errorData;
  
  if(errorData instanceof Error)
  {
    errorText={
      name: errorData.name,
      message: errorData.message,
      stack: errorData.stack,
    };
  }

  if (process.env.NODE_ENV === 'prod' && errorData) {
    console.log("Error not sent to client since NODE_ENV = 'prod': ");
    console.log(errorText);
  } else {
    console.log(errorText);
    error.output.payload.errorData = errorText;
  }

  return error;
};
