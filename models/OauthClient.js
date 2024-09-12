import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  clientId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  clientSecret: {
    type: String,
    trim: true,
    required: true,
  },
  redirectUris: [String],
  grants: [String],
}, { timestamps: true });

const OauthClient = model('OauthClient', clientSchema);

export default OauthClient;