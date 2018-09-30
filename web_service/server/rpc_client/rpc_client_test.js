const client = require("./rpc_client_service");

// client.add(1, 2, function(response) {
//   console.assert(response === 3);
// });

client.getNewsSummariesForUser("test_user", 1, function(response) {
  console.log("start testt rpc service")
  console.assert(response !== null);
});
