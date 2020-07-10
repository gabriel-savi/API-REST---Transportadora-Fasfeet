import Deliveryman from '../models/deliveryman';
import FilesDeliveryman from '../models/filesDeliveryman';

class DeliverymanController {
  async store(req, res) {
    const { id, name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name, 
      email,
      avatar_id
    })
  }

  async update(req, res) {
    try {
      const { email } = req.body;

      const deliveryman = await Deliveryman.findByPk(req.params.id);

      if (email !== deliveryman.email) {
        const userExists = await Deliveryman.findOne({ where: { email } });
  
        if (userExists) {
          return res.status(400).json({ error: 'Email já existe!' });
        }
      }

      if(!deliveryman) {
        return res.status(400).json({ error: 'Não foi encontrado nenhum entregador!' });
      }

      const { id, name, avatar_id } = await deliveryman.update(req.body);

      return res.json({
        id,
        name,
        email,
        avatar_id
      });
    } 
    catch(err) {
      return res.status(500).json({ error: 'Erro inesperado!'});
    }
  }

  async delete(req, res) {
    try {
      const deliveryman = await Deliveryman.findByPk(req.params.id);

      if(!deliveryman) {
        return res.status(400).json({ error: 'Não foi encontrado nenhum entregador!' });
      }

      await deliveryman.destroy();

      return res.json({ message: `Entregador deletado com sucesso!` });
    } 
    catch(err) {
      return res.status(500).json({ error: 'Erro inesperado!'});
    }
  }

  async index(req, res) {
    try {
      const deliveryman = await Deliveryman.findAll({
        attributes: ['id', 'name', 'email'],
        include: [
          {
            model: FilesDeliveryman,
            as: 'filesdeliveryman',
            attributes: ['id', 'name', 'path', 'url']
          }
        ]
      });

      return res.json(deliveryman);
    } 
    catch(err) {
      return res.status(500).json({ error: 'Erro inesperado!'});
    }
  }
}

export default new DeliverymanController();