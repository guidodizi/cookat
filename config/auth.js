// expose our config directly to our application using module.exports
module.exports = {
  facebookAuth: {
    clientID: "895792863919984", // your App ID
    clientSecret: "a04a7056ff398083f2d80996965bc650", // your App Secret
    callbackURL: "https://cookat.herokuapp.com/auth/facebook/callback",
    profileURL:
      "https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email",
    profileFields: ["id", "emails", "displayName"] // For requesting permissions from Facebook API
  },

  googleAuth: {
    clientID: "your-secret-clientID-here",
    clientSecret: "your-client-secret-here",
    callbackURL: "http://localhost:8080/auth/google/callback"
  }
};
