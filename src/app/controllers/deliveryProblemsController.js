import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';

import DeliveryProblems from '../models/deliveryProblems';
import Deliveryman from '../models/deliveryman';
import Recipients from '../models/recipients';
import Orders from '../models/orders';
import Mail from '../../lib/Mail';

class DeliveryProblemsController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll({
      attributes: ['id', 'description', 'delivery_id'],
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
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const delivery_id = req.params.id;

    const existsDelivery = await Orders.findOne({
      where: { id: delivery_id, end_date: null, canceled_at: null }
    });

    if (!existsDelivery) {
      return res.status(400).json({ error: 'Entrega não existe ou já foi entregue/cancelada' });
    }

    const { description } = req.body;

    const problems = { delivery_id, description };

    const { id } = await DeliveryProblems.create(problems);

    return res.json({ id, delivery_id, description });
  }

  async delete(req, res) {
    const problem = await DeliveryProblems.findOne({
      where: {
        delivery_id: req.params.id
      }
    });

    if (!problem) {
      return res.status(400)
      .json({ error: 'Não é possível cancelar essa encomenda, pois não existe nenhum problema associado à ela!' })
    }

    const orders = await Orders.findOne({ 
      where: {
        id: req.params.id,
        end_date: null
      },
      attributes: ['id', 'recipient_id', 'signature_id', 'product', 'canceled_at', 'start_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'name',
          ],
        },
      ],
    });

    if (!orders) {
      return res.status(400).json({ error: 'Entrega não encontrada ou já finalizada!' })
    }

    orders.canceled_at = new Date();

    await orders.save();

    await Mail.sendMail({
      to: `${orders.deliveryman.name} <${orders.deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        deliveryman: orders.deliveryman.name,
        orders: orders.id,
        recipient: orders.recipient.name,
        date: format(orders.canceled_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(orders);
  }
}

export default new DeliveryProblemsController();