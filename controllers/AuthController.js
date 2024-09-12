import Joi from "joi";
import User from "../models/User.js";

class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res) {
    // validate input
    const { error } = Joi.object({
      name: Joi.string().trim().min(3).max(30).required(),
      email: Joi.string().trim().email().lowercase().required(),
      password: Joi.string().trim().min(6).required(),
    }).validate(req.body);

    if(error) return res.status(422).json({ message: error.details[0].message });

    try {
      const { name, email, password } = req.body;

      // check if email already exists
      const isExist = await User.findOne({ email });
      if(isExist) return res.status(400).json({ message: 'User already exist' });

      // create user
      const user = new User({ name, email, password });
      await user.save();

      // create access token
      const token = await user.createToken();

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch(error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async login(req, res) {
    // validate input
    const { error } = Joi.object({
      email: Joi.string().trim().email().lowercase().required(),
      password: Joi.string().trim().min(6).required(),
    }).validate(req.body);

    if(error) return res.status(422).json({ message: error.details[0].message });

    try {
      const { email, password } = req.body;

      // check if email already exists
      const user = await User.findOne({ email }).select("+password");
      if(!user) return res.status(400).json({ message: 'Invalid credentials' });

      // create user
      const isVerified = await user.comparePassword(password);
      if(!isVerified) return res.status(400).json({ message: 'Invalid credentials' });

      // create access token
      const token = await user.createToken();

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } catch(error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export default new AuthController();