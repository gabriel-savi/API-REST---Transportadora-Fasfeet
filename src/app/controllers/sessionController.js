import jwt from 'jsonwebtoken';

import User from '../models/user';
import Auth from '../../config/auth';

class SessionController {
  async store(req, res) {
    
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if(!user) {
      return res.status(401).json({ error: 'Email não encontrado!' });
    }

    if(!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha incorreta! ' });
    }

    const { id, name } = user;

    return res.json({
      user: {  
        id,
        name,
        email
      },
      token: jwt.sign({ id }, Auth.secret, {
        expiresIn: Auth.expiresIn
      })
    })
  }
}

export default new SessionController();