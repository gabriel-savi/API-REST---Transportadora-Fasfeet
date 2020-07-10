import Orders from '../models/orders';
import Deliveryman from '../models/deliveryman';
import Recipients from '../models/recipients';

import { Op } from 'sequelize';

class ordersDeliveredController {
  async index(req, res) {
    const orders = await Orders.findAll({ 
      where: { deliveryman_id: req.params.id,
               end_date: {
                 [Op.not]: null,
               }
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name']
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: ['id', 'name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep']
        }
      ]
    });

    return res.json(orders);
  }
}

export default new ordersDeliveredController();