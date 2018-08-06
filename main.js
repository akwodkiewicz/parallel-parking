var connect = require("connect");
var serveStatic = require("serve-static");

var app = connect();

app.use(serveStatic("app"));
app.listen(5000, () =>
  console.log("Server is now listening on http://localhost:5000")
);
