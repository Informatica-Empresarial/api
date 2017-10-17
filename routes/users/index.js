var routes = [];

routes.push(
  require("./post"),
  require("./delete"),
  require("./put"),
  require("./get"),
  require("./reset_password")
)

module.exports = routes;
