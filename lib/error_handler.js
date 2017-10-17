
class ErrorHandler {
    errorPromise (message) {
        return new Promise ((resolve, reject) =>{reject(message)})
    }
  
}

export default new ErrorHandler()