import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Recipients from '../app/models/recipients';
import User from '../app/models/user';
import FileDeliveryman from '../app/models/filesDeliveryman';
import FilesOrders from '../app/models/filesOrders';
import Deliveryman from '../app/models/deliveryman';
import Orders from '../app/models/orders';
import DeliveryProblems from '../app/models/deliveryProblems';

const models = [Recipients, User, FileDeliveryman, Deliveryman, FilesOrders, Orders, DeliveryProblems];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
    .map((model) => model.init(this.connection))
    .map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();