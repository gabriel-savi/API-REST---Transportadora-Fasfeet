import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Orders from '../models/orders';
import Deliveryman from '../models/deliveryman';
import Recipients from '../models/recipients';
import FilesOrders from '../models/filesOrders';
import Mail from '../../lib/Mail';

class OrdersController {
  async store(req, res) {
    const {
      id,
      recipient_id,
      deliveryman_id,
      product
    } = await Orders.create(req.body);

    const orders = await Orders.findOne({
      where: id,
      attributes: ['id', 'product'],
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
            'id',
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
      ],
    });

    await Mail.sendMail({
      to: `${orders.deliveryman.name} <${orders.deliveryman.email}>`,
      subject: 'Novo Pedido',
      template: 'created',
      context: {
        deliveryman: orders.deliveryman.name,
        recipient: orders.recipient.name,
        orders: orders.id,
        product: orders.product,
        adress: `Rua ${orders.recipient.rua}, ${orders.recipient.numero}`, 
        city: `Cidade: ${orders.recipient.cidade} - ${orders.recipient.estado}`,
        cep: `Cep: ${orders.recipient.cep}`,
        date: format(new Date(),"'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json({ 
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async index(req, res) {
    const orders = await Orders.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model:Recipients,
          as: 'recipient',
          attributes: ['id', 'name', 'rua', 'numero', 'complemento', 'estado', 'cidade', 'cep']
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name']
        },
        {
          model: FilesOrders,
          as: 'filesOrders',
          attributes: ['id', 'name', 'path', 'url']
        },
      ]
    });

    return res.json(orders);
  }

  async update(req, res) {
    const orders = await Orders.findByPk(req.params.id);

    const {
      id,
      recipient_id,
      deliveryman_id,
      product
    } = await orders.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product
    })
  }

  async delete(req, res) {
    const orders = await Orders.findOne({
     where: {
      id: req.params.id,
      canceled_at: null,
      start_date: null,
      end_date: null
     }
    });

    if (!orders) {
      return res.status(400).json({ error: 'Entrega não existe ou não pode ser deletada!' })
    }

    await orders.destroy();

    return res.json({ message: 'Entrega deletada com sucesso!' });
  }
}

export default new OrdersController();