const sequelize = require('../db');
const {QueryTypes} = require('sequelize');

const ApiError = require('../error/ApiError');
const {User, Purchase, Requisite} = require('../models/models')

class WorkerController {

    async requisite(req, res) {
        const {user_id} = req.body;
        try {
            const requisite = await sequelize.query("SELECT r.requisite_name, r.requisite_info, r.requisite_status FROM requisites r WHERE r.user_id = $user_id", {
                type: QueryTypes.SELECT,
                bind: {user_id: user_id}
            });
            return res.json(requisite);
        } catch (e) {
            return res.json(e.message);
        }
    }

    async requisiteadd(req, res) {
        try {
            const {requisite_name, requisite_info, user_id} = req.body;
            const requisite = await sequelize.query("INSERT INTO requisites (requisite_name, requisite_info, requisite_status, user_id) " +
                "VALUES ($requisite_name, $requisite_info, $requisite_status, $user_id)",
                {
                    type: QueryTypes.INSERT,
                    bind: {requisite_name: requisite_name, requisite_info: requisite_info , requisite_status: "НОВЫЙ", user_id: user_id}
                });
            return res.json({message: "Новый реквизит добавлен!"});
        } catch (e) {
            return res.json(e.message);
        }
    }

    async purshasecreate(req, res) {
        try{
            const {req_id} = req.body;
            const newpurchase = await sequelize.query("INSERT INTO purchases (requisite_id, purchase_status) " +
                "VALUES ($requisite_id, $purchase_status)",
                {
                    type: QueryTypes.INSERT,
                    bind: {requisite_id: req_id,purchase_status: "ОЖИДАЕТСЯ ЗАКУПКА"}
                });
            return res.json({message: "Заявка на закупку успешно отправлена менеджеру!"});
        }catch (e) {
            return res.json(e.message)
        }
    }

    async upcomingworks(req, res) {
        try {
            const {user_id} = req.body;
            const works = await sequelize.query("SELECT o.order_id, o.event_name, o.event_date, o.event_place, event_status, c.client_name, c.client_phone " +
                "FROM user_orders u_o " +
                "JOIN users u ON (u.id = u_o.user_id) " +
                "JOIN orders o ON (o.order_id = u_o.order_id)" +
                "JOIN clients c ON (o.client_id = c.client_id)" +
                "WHERE o.event_status='ЗАБРОНИРОВАНО' AND u_o.user_id = $user_id", {
                type: QueryTypes.SELECT,
                bind: {user_id: user_id}
            });
            return res.json(works);
        } catch (e) {
            return res.json(e.message);
        }
    }

    async completeorder(req, res) {
        try{
            const {order_id} = req.body;
            const completed = await sequelize.query("UPDATE orders SET event_status = 'ВЫПОЛНЕНО' WHERE order_id = $order_id",
                {
                    type: QueryTypes.UPDATE,
                    bind: {order_id: order_id}
                });
            return res.json({message: "Заказ выполнен!"});
        }catch (e) {
            return res.json(e.message);
        }
    }

    //временно нереализовано и скорее всего не будет реализовано
    async purchases(req, res) {
        //const requisites = await Requisite.findAll({where: {userid: user.id}});
        //const purchases = await Purchase.findAll({where: {requisiteRequisiteId: requisites.requisite_id}});
        //return res.json(purchases);
        const {user_id} = req.query;
        try {
            const purchases = await sequelize.query("SELECT * FROM purchases r WHERE r.user_id = $user_id",
                {type: QueryTypes.SELECT, bind: {user_id: user_id}});
            return res.json(purchases);
        } catch (e) {
            return res.json(e.message);
        }
    }
}

module.exports = new WorkerController()