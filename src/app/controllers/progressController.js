import Orders from '../models/orders';
import { setHours, setMinutes, parseISO, setSeconds, isBefore, isAfter, format, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

class ProgressController {
  async update(req, res) {
    const orders = await Orders.findOne({ 
      where: { id: req.params.id, canceled_at: null, start_date: null, end_date: null },
      attributes: ['id', 'recipient_id', 'deliveryman_id', 'product', 'start_date']
    });

    if(!orders) {
      return res.status(400).json({ error: 'Entrega não pode ser iniciada!' })
    }

    const hourIni = '08:00';
    const hourFim = '18:00';
    
    const [hour, minute] = hourIni.split(':');
    const [hourF, minuteF] = hourFim.split(':');
    
    var data = parseISO(format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"));
    
    var value = setSeconds(setMinutes(setHours(data, hour), minute), 0);
    var valueF = setSeconds(setMinutes(setHours(data, hourF), minuteF), 0);
    
    if (isBefore(data, value) || isAfter(data, valueF)) {
      return res.status(401).json({ error: 'O horário de entrega é entre as 08:00h e as 18:00h!' });
    }

    const countOrders = await Orders.count({ 
      where: { 
        deliveryman_id: orders.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(data), endOfDay(data)]
        }} 
    });

    if(countOrders >= 5) {
      return res.status(400).json({ error: 'Já atingiu o limite de 5 retiradas no dia!'})
    }
    orders.start_date = new Date();
    await orders.save();

    return res.json(orders);
  }
}

export default new ProgressController();