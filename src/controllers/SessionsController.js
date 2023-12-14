const { sign } = require("jsonwebtoken");
const { compare } = require('bcryptjs');
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const {secret, expiresIn} = require("../configs/auth").jwt;

class SessionController {
  async create(req, res){
    try {
      const {email, password} = req.body;
      const user = await knex("users").where({email}).first();
      if(!user){
        throw new AppError("Usuário e/ou senha inválidos", 401);
      }
      const isPasswordValid = await compare(password, user.password);
      if(!isPasswordValid){
        throw new AppError("Usuário e/ou senha inválidos.");
      }
      const token = sign({}, secret, {subject: String(user.id), expiresIn});
      return res.json({
        user: {name: user.name, email: user.email, avatar: user.avatar ? user.avatar : ""},
        token
      })
    } catch (error) {
      throw new AppError(error, 401);
    }
  }
}
module.exports = SessionController;