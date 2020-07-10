import Orders from '../models/orders';
import filesOrders from '../models/filesOrders';

import { Op } from 'sequelize';

class EndProgressController {
  async update(req, res) {
    const orders = await Orders.findOne({
      where: { id: req.params.id, canceled_at: null, 
        start_date: {
          [Op.not]: null
        },
        end_date: null
    },
    attributes: ['id', 'recipient_id', 'deliveryman_id', 'signature_id', 'product', 'start_date', 'end_date'],
    })

    if(!orders) {
      return res.status(400).json({ error: 'A encomenda não foi iniciada ou foi cancelada!' });
    }

    orders.end_date = new Date();    

    const { originalname: name, filename: path } = req.file;

    const { id } = await filesOrders.create({
      name,
      path,
    });

    orders.signature_id = id;

    await orders.save();

    return res.json(orders);
  }
}

 export default new EndProgressController();