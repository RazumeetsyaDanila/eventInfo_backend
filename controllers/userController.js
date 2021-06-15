const sequelize = require("../db");
const { QueryTypes } = require("sequelize");

const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Tariff, Order } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (user) {
      const token = generateJwt(
        user.dataValues.id,
        email,
        user.dataValues.role
      );
      res.status(200).send({
        token,
        user: {
          id: user.dataValues.id,
          name: user.dataValues.name,
          email: email,
          role: user.dataValues.role,
        },
      });
    } else {
      res.sendStatus(404);
    }
  }

  async orders(req, res) {
    const orders = await sequelize.query(
      "SELECT u.name, o.order_id, o.event_date, o.event_start_time, o.event_end_time, " +
        "o.event_people_count, o.event_place, o.event_name, o.event_status FROM orders o " +
        "LEFT JOIN user_orders u_o ON (u_o.order_id = o.order_id)" +
        "LEFT JOIN users u ON (u.id = u_o.user_id)",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (orders.length) {
      res.status(200).send({ orders });
    } else {
      res.sendStatus(404);
    }
  }

  async tariffs(req, res) {
    try{
      const tariffs = await sequelize.query(
          "SELECT tariff_name, tariff_price, salary_worker FROM tariffs",
          { type: QueryTypes.SELECT }
      );
      return res.json(tariffs);
    }catch (e) {
      return res.json(e.message)
    }
  }

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();
