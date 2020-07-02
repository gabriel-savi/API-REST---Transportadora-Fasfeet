import Recipients from '../models/recipients';
import * as Yup from 'yup';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({ error: 'Erro de validação' });
    }

    const { name, rua, numero, complemento, estado, cidade, cep} = await Recipients.create(req.body);

    return res.json({
      name, 
      rua, 
      numero, 
      complemento, 
      estado, 
      cidade, 
      cep
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({ error: 'Erro de validação' });
    }

    const recipients = await Recipients.findByPk(req.body.id);

    const { name, rua, numero, complemento, estado, cidade, cep} = await recipients.update(req.body);

    return res.json({
      name, 
      rua, 
      numero,
      complemento, 
      estado, 
      cidade, 
      cep
    })
  }

  async delete(req, res) {
    await Recipients.destroy({ where: {id: req.params.id} });

    return res.status(200).json({ message: `Recipient com ID: ${req.params.id} deletado com sucesso!`});
  }

  async index(req, res) {
    const recipientes = await Recipients.findAll();

    res.json(recipientes);
  }

  async show(req, res) {
    const recipiente = await Recipients.findOne({ where: { id : req.params.id} });

    res.json(recipiente);
  }
}

export default new RecipientsController();