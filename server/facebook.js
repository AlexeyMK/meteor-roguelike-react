Meteor.startup(function () {
  // This only works on localhost
  if (!Accounts.loginServiceConfiguration.findOne({service: "facebook"})) {
    Accounts.loginServiceConfiguration.insert({
      service: "facebook",
      appId: "162346983924869",
      secret: "a844ee020723050bafed7926e7322765"
    });
  }
});