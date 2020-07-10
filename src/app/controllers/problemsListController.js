import DeliveryProblems from '../models/deliveryProblems';
import Deliveryman from '../models/deliveryman';
import Recipients from '../models/recipients';
import Orders from '../models/orders';

class ProblemsListController {
  async index(req, res) {
    const problems = await DeliveryProblems.findAll({
      where: {
        delivery_id: req.params.id
      },
      attributes: ['id', 'delivery_id', 'description'],
      include: [
        {
          model: Orders,
          as: 'orders',
          attributes: ['product', 'start_date'],
          include: [
            {
              model: Recipients,
              as: 'recipient',
              attributes: ['id', 'name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep']
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    return res.json(problems);
  }
}

export default new ProblemsListController();