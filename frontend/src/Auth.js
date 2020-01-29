import auth0 from 'auth0-js';

require('dotenv').config();

// const domainID = process.env.AUTH0_DOMAIN;
console.log('AUTH0_DOMAIN=' + process.env.AUTH0_DOMAIN);
// const auth0Option = {
//   // the following three lines MUST be updated
//   // domain: process.env.AUTH0_DOMAIN,
//   domain: 'dev-gviqn817.auth0.com',
//   audience: 'dev-gviqn817.auth0.com/userinfo',
//   clientID: '1eMZjBiIqulUf5Gt4ryWY7cKmlhwsFiH',
//   redirectUri: 'http://localhost:3000/callback',
//   responseType: 'id_token',
//   scope: 'openid profile'
// };

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      // domain: process.env.AUTH0_DOMAIN,
      domain: 'dev-gviqn817.auth0.com',
      audience: 'dev-gviqn817.auth0.com/userinfo',
      clientID: '1eMZjBiIqulUf5Gt4ryWY7cKmlhwsFiH',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'id_token',
      scope: 'openid profile'
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        resolve();
      });
    })
  }

  signOut() {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  }
}

const auth0Client = new Auth();

export default auth0Client;
