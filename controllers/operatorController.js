const ApiError = require('../error/ApiError');
const {Client, Order} = require('../models/models')


class OperatorController {

    async clientadd(req, res) {
        try {
            const {client_email, client_name, client_phone} = req.body;
            const client = await Client.create({client_email, client_name, client_phone});
            return res.json({message: "Запись о клиенте успешно создана!"});
        } catch (e) {
            return res.json(e.message);
        }
    }

    async orderadd(req, res) {
        try {
            const {event_name, event_date, event_start_time, event_end_time, event_people_count, event_place, questQuestId, clientClientId, tariffTariffId} = req.body;
            const order = await Order.create({
                event_name,
                event_date,
                event_start_time,
                event_end_time,
                event_people_count,
                event_place,
                event_status: "ЗАБРОНИРОВАНО",
                questQuestId,
                clientClientId,
                tariffTariffId
            });
            return res.json({message: "Заказ добавлен!"});
        } catch (e) {
            return res.json(e.message);
        }
    }

    async calculation(req, res, next) {

    }
}

module.exports = new OperatorController()