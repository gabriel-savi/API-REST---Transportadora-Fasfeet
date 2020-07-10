import Orders from '../models/orders';
import Deliveryman from '../models/deliveryman';
import Recipients from '../models/recipients';

class OrdersListController {
  async index(req, res) {
    const orders = await Orders.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null
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

    if (!orders) {
      return res.status(400).json({ error: 'Não existem encomendas atribuídas à você!' })
    }

    return res.json(orders);
  }
}

export default new OrdersListController();