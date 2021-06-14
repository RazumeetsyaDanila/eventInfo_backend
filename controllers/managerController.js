const sequelize = require("../db");
const { QueryTypes } = require("sequelize");

const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  User,
  Tariff,
  Purchase,
  Requisite,
  Order,
  UserOrder,
} = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
};

class ManagerController {
  async tariffadd(req, res) {
    const { tariff_name, tariff_price, salary_worker } = req.body;
    const tariff = await Tariff.create({
      tariff_name,
      tariff_price,
      salary_worker,
    });
    return res.json({ message: "Тариф добавлен!" });
  }

  async unprocessedpursh(req, res) {
    const purchases = await sequelize.query(
      "SELECT r.requisite_name, p.purchase_status FROM purchases p JOIN requisites r ON (p.requisite_id = r.requisite_id)" +
        "WHERE p.purchase_status = 'ОЖИДАЕТСЯ ЗАКУПКА'",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (purchases.length) {
      res.status(200).send({ purchases });
    } else {
      res.sendStatus(404);
    }
  }

  async purchases(req, res) {
    const purchases = await sequelize.query(
      "SELECT r.requisite_name, p.purchase_status FROM purchases p JOIN requisites r ON (p.requisite_id = r.requisite_id)",
      {
        type: QueryTypes.SELECT,
      }
    );
    return res.json(purchases);
  }

  async completepurchase(req, res) {
    try {
      const { purchase_id } = req.body;
      const purchase = await sequelize.query(
        "UPDATE purchases SET purchase_status = 'ИСПОЛНЕНО' WHERE purchase_id = $purchase_id",
        {
          type: QueryTypes.UPDATE,
          bind: { purchase_id: purchase_id },
        }
      );
      return res.json({ message: "Заявка исполнена!" });
    } catch (e) {
      return res.json(e.message);
    }
  }

  async requisite(req, res) {
    try {
      const requisite = await sequelize.query(
        "SELECT requisite_name, requisite_info, requisite_status FROM requisites",
        {
          type: QueryTypes.SELECT,
        }
      );
      return res.json(requisite);
    } catch (e) {
      return res.json(e.message);
    }
  }

  async report(req, res, next) {}

  async workers(req, res) {
    const workers = await sequelize.query(
      "SELECT name, email, role,id FROM users",
      {
        type: QueryTypes.SELECT,
      }
    );
    if (workers.length) {
      res.status(200).send({ workers });
    } else {
      res.sendStatus(404);
    }
  }

  //date_part('day',o.event_date)
  /*async works(req, res) {
        const {user_id} = req.body;
        try {
            const works = await sequelize.query("SELECT u.name, o.order_id, " +
                "date_part('year',o.event_date) as event_year, " +
                "date_part('month',o.event_date) as event_month, " +
                "date_part('day',o.event_date) as event_day, " +
                "date_part('hour',o.event_start_time) as start_hour, " +
                "date_part('minute',o.event_start_time) as start_minute " +
                "FROM user_orders u_o " +
                "JOIN users u ON (u.id = u_o.user_id) " +
                "JOIN orders o ON (o.order_id = u_o.order_id)" +
                "WHERE o.event_status='ВЫПОЛНЕНО' and u.id = $user_id", {
                type: QueryTypes.SELECT,
                bind: {user_id: user_id}
            });
            return res.json(works);
        } catch (e) {
            return res.json(e.message);
        }
    }*/

  async upcomingworks(req, res) {
    try {
      const works = await sequelize.query(
        "SELECT o.order_id, o.event_name, o.event_date, event_status, c.client_name, c.client_phone " +
          "FROM user_orders u_o " +
          "JOIN users u ON (u.id = u_o.user_id) " +
          "JOIN orders o ON (o.order_id = u_o.order_id)" +
          "JOIN clients c ON (o.client_id = c.client_id)" +
          "WHERE o.event_status='ЗАБРОНИРОВАНО'",
        {
          type: QueryTypes.SELECT,
        }
      );
      return res.json(works);
    } catch (e) {
      return res.json(e.message);
    }
  }

  async completeworks(req, res) {
    const { user_id } = req.body;
    try {
      const works = await sequelize.query(
        "SELECT o.order_id, u.name, o.event_name, o.event_date, o.event_status " +
          "FROM user_orders u_o " +
          "JOIN users u ON (u.id = u_o.user_id) " +
          "JOIN orders o ON (o.order_id = u_o.order_id)" +
          "WHERE o.event_status='ВЫПОЛНЕНО' and u.id = $user_id",
        {
          type: QueryTypes.SELECT,
          bind: { user_id: user_id },
        }
      );
      return res.json(works);
    } catch (e) {
      return res.json(e.message);
    }
  }

  async registration(req, res, next) {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    // const user = await User.create({name, email, role, password: hashPassword})
    const user = await User.create({ name, email, role, password });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async assignment(req, res) {
    const { user_id, order_id } = req.body;
    try {
      const time_appoint = await sequelize.query(
        "SELECT date_part('year',o.event_date) as event_year, " +
          "date_part('month',o.event_date) as event_month, " +
          "date_part('day',o.event_date) as event_day, " +
          "date_part('hour',o.event_start_time) as start_hour, " +
          "date_part('hour',o.event_end_time) as end_hour, " +
          "date_part('minute',o.event_start_time) as start_minute " +
          "FROM orders o WHERE o.order_id = $order_id",
        { type: QueryTypes.SELECT, bind: { order_id: order_id } }
      );
      var { event_year, event_month, event_day, start_hour, end_hour } =
        time_appoint[0];
    } catch (e) {
      return res.json(e.message);
    }
    //на данный момент мы имеем массив id-шников всех забронированных заказов выбранного ведущего, а также точное время нового заказа
    //следующим шагом необходимо найти те заказы, которые забронированы на тот же день что и назначаемый заказ, иначе выполнить успешное назначение
    try {
      const competing_orders = await sequelize.query(
        "SELECT u_o.order_id, date_part('hour',o.event_start_time) AS start_time, date_part('hour',o.event_end_time) AS end_time " +
          "FROM user_orders u_o JOIN orders o ON (u_o.order_id = o.order_id) " +
          "WHERE u_o.user_id = $user_id and o.event_status = 'ЗАБРОНИРОВАНО' and " +
          "o.order_id != $order_id and " +
          "date_part('year',o.event_date) = $event_year and " +
          "date_part('month',o.event_date) = $event_month and " +
          "date_part('day',o.event_date) = $event_day",
        {
          type: QueryTypes.SELECT,
          bind: {
            user_id: user_id,
            order_id: order_id,
            event_year: event_year,
            event_month: event_month,
            event_day: event_day,
          },
        }
      );
      if (Object.keys(competing_orders).length == 0) {
        //запрос на назначение ведущего
        const success_assignment = await sequelize.query(
          "INSERT INTO user_orders (user_id, order_id) VALUES ($user_id, $order_id)",
          {
            type: QueryTypes.INSERT,
            bind: { user_id: user_id, order_id: order_id },
          }
        );
        res.status(200).send({ message: "Ведущий назначен!" });
      }
      const orders_count = competing_orders.length;
      for (let i = 0; i < orders_count; i++) {
        if (
          (start_hour > competing_orders[i].start_time &&
            start_hour < competing_orders[i].end_time) ||
          (end_hour > competing_orders[i].start_time &&
            start_hour < competing_orders[i].end_time)
        ) {
          res
            .status(200)
            .send({ message: "Выбранный ведущий занят в это время!" });
        }
      }
      //запрос на назначение ведущего
      const success_assignment = await sequelize.query(
        "INSERT INTO user_orders (user_id, order_id) VALUES ($user_id, $order_id)",
        {
          type: QueryTypes.INSERT,
          bind: { user_id: user_id, order_id: order_id },
        }
      );
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(400);
    }
  }
}

module.exports = new ManagerController();
