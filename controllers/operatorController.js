const ApiError = require('../error/ApiError');
const {Client, Order} = require('../models/models')


class OperatorController {

    async clientadd(req, res) {
        const {client_email, client_name, client_phone} = req.body;
        const client = await Client.create({client_email, client_name, client_phone});
        return res.json(client);
    }

    async orderadd(req, res) {
        const {event_date, event_start_time, event_end_time, event_people_count, event_place, questQuestId, clientClientId, tariffTariffId} = req.body;
        const order = await Order.create({event_date, event_start_time, event_end_time, event_people_count, event_place, questQuestId, clientClientId, tariffTariffId});
        return res.json(order);
    }

    async calculation(req, res, next) {

    }
}

module.exports = new OperatorController()