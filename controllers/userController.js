const sequelize = require('../db');
const {QueryTypes} = require('sequelize');

const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Tariff, Order} = require('../models/models')


const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {

    async login(req, res, next) {
       const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async orders(req, res) {
        const orders = await sequelize.query("SELECT event_date, event_start_time, event_end_time, " +
            "event_people_count, event_place, event_name, event_status FROM orders", { type: QueryTypes.SELECT});
        return res.json(orders);
    }

    async tariffs(req, res) {
        const tariffs = await sequelize.query("SELECT tariff_name, tariff_price, salary_worker FROM tariffs", { type: QueryTypes.SELECT});
        return res.json(tariffs);
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()