const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "WORKER", allowNull: false}
});

const Requisite = sequelize.define('requisite', {
    requisite_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    requisite_name: {type: DataTypes.STRING, allowNull: false},
    requisite_info: {type: DataTypes.STRING},
    requisite_status: {type: DataTypes.STRING, allowNull: false}
});

const Purchase = sequelize.define('purchase', {
    purchase_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    purchase_date: {type: DataTypes.DATE},
    purchase_price: {type: DataTypes.INTEGER},
    purchase_status: {type: DataTypes.STRING, defaultValue: "В ПРОЦЕССЕ", allowNull: false}
});

const Quest = sequelize.define('quest', {
    quest_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    quest_name: {type: DataTypes.STRING, allowNull: false},
    quest_info: {type: DataTypes.STRING}
});

const Order = sequelize.define('order', {
    order_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    event_date: {type: DataTypes.DATE, allowNull: false},
    event_start_time: {type: DataTypes.DATE},
    event_end_time: {type: DataTypes.DATE},
    event_people_count: {type: DataTypes.INTEGER},
    event_place: {type: DataTypes.STRING},
    event_status: {type: DataTypes.STRING},
    event_name: {type: DataTypes.STRING}
});

const Client = sequelize.define('client', {
    client_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    client_email: {type: DataTypes.STRING},
    client_name: {type: DataTypes.STRING, allowNull: false},
    client_phone: {type: DataTypes.STRING, allowNull: false}
});

const Tariff = sequelize.define('tariff', {
    tariff_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    tariff_name: {type: DataTypes.STRING, allowNull: false},
    tariff_price: {type: DataTypes.INTEGER, allowNull: false},
    salary_worker: {type: DataTypes.INTEGER, allowNull: false}
});

const UserOrder = sequelize.define('user_order', {
    user_order_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const QuestRequisite = sequelize.define('quest_requisite', {
    user_order_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

User.hasMany(Requisite);
Requisite.belongsTo(User);

Requisite.hasMany(Purchase);
Purchase.belongsTo(Requisite);

User.belongsToMany(Order, {through: UserOrder});
Order.belongsToMany(User, {through: UserOrder});

Requisite.belongsToMany(Quest, {through: QuestRequisite});
Quest.belongsToMany(Requisite, {through: QuestRequisite});

Quest.hasMany(Order);
Order.belongsTo(Quest)

Client.hasMany(Order);
Order.belongsTo(Client);

Tariff.hasMany(Order);
Order.belongsTo(Tariff);

module.exports = {
    User,
    Requisite,
    Purchase,
    Quest,
    Order,
    Client,
    Tariff,
    UserOrder,
    QuestRequisite
}