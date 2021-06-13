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
        const orders = await Order.findAll();
        return res.json(orders);
    }

    async tariffs(req, res) {
        const price = 2000;
        //const tariffs = await Tariff.findAll();
        //const [tariffs, metadata] = await sequelize.query("SELECT * FROM Tariffs WHERE tariff_price = 1000")
        //const tariffs = await sequelize.query("SELECT * FROM Tariffs WHERE tariff_price = $price", { type: QueryTypes.SELECT, bind:{price: price}})
        const tariffs = await sequelize.query("SELECT * FROM tariffs", { type: QueryTypes.SELECT});
        return res.json(tariffs);
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()