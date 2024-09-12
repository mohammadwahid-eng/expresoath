import { Router } from 'express';
import OauthServer from 'express-oauth-server';
import OauthModel from '../models/OauthModel.js';

const router = Router();
const oauth = new OauthServer({ model: OauthModel });

router.get('/', (req, res) => {
  res.status(200).json({ message: 'expressoath: web' })
});

router.post('/oauth/token', oauth.token());
router.get('/secured', oauth.authenticate(), (req, res) => {
  res.send('Secure data');
})

export default router;