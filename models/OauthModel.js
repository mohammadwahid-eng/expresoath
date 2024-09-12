import User from './User.js';
import OauthClient from './OauthClient.js';
import jwt from 'jsonwebtoken';

class OauthModel {
  constructor() {
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getClient      = this.getClient.bind(this);
    this.getUser        = this.getUser.bind(this);
    this.saveToken      = this.saveToken.bind(this);
  }
  
  async getAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return null;
      return {
        accessToken: token,
        client: { id: decoded.clientId },
        user: { id: decoded.userId },
        accessTokenExpiresAt: new Date(decoded.exp * 1000),
      };
    });
  }

  async getClient(clientId, clientSecret) {
    try {
      return OauthClient.findOne({clientId, clientSecret});
    } catch(error) {
      console.log(error);
    }
  }

  async getUser(email, password) {
    try {
      // find user by email
      const user = await User.findOne({email});
      if(!user) {
        return null;
      }
      
      // verify password
      const isMatched = await user.comparePassword(password);
      if(!isMatched) return null;
      
      return user;
    } catch(error) {
      console.log(error);
    }
  }

  async saveToken(token, client, user) {
    const accessToken = jwt.sign({
      userId: user._id,
      clientId: client._id,
    }, process.env.JWT_SECRET,
    { expiresIn: '1h' });

    return {
      accessToken,
      client,
      user,
      accessTokenExpiresAt: new Date(Date.now() + 3600000),
    };
  }
}

export default new OauthModel();