const sequelize = require('../db');
const {QueryTypes} = require('sequelize');

const ApiError = require('../error/ApiError');
const {User, Purchase, Requisite} = require('../models/models')

class WorkerController {

    async requisite(req, res) {
        const {user_id} = req.query;
        try {
            const requisite = await sequelize.query("SELECT * FROM requisites r WHERE r.user_id = $user_id", {type: QueryTypes.SELECT, bind:{user_id: user_id}});
            return res.json(requisite);
        } catch (e) {
            return res.json(e.message);
        }
    }

    async requisiteadd(req, res) {
        try{
            const {requisite_name, requisite_info, userId} = req.body;
            const requisite = await Requisite.create({requisite_name, requisite_info, requisite_status: "НОВЫЙ", userId});
            return res.json(requisite);
        }
        catch (e) {
            return res.json(e.message);
        }
    }

    async purshasecreate(req, res) {
        const {req_id} = req.body;
        const newpurchase = await Purchase.create({purchase_status: "ОЖИДАЕТСЯ ЗАКУПКА", requisiteRequisiteId: req_id});
        return res.json(newpurchase);
    }

    //под вопросом необходимости
    async purchases(req, res) {
        //const requisites = await Requisite.findAll({where: {userid: user.id}});
        //const purchases = await Purchase.findAll({where: {requisiteRequisiteId: requisites.requisite_id}});
        //return res.json(purchases);
        const {user_id} = req.query;
        try {
            const purchases = await sequelize.query("SELECT * FROM purchases r WHERE r.user_id = $user_id",
                {type: QueryTypes.SELECT, bind:{user_id: user_id}});
            return res.json(purchases);
        } catch (e) {
            return res.json(e.message);
        }
    }
}

module.exports = new WorkerController()