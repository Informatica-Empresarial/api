var checkAlreadyExists = function checkAlreadyExists(result) {
    if (result.message.endsWith("already exists") ||
        result.message.endsWith("does not exist")
    ) {
        console.log("Warning: " + result.message);
        return;
    }
    throw result;
};

module.exports.checkAlreadyExists = checkAlreadyExists;