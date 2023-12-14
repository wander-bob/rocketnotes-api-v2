const {verify} = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
function ensureAuthenticated(request, response, next){
  const authHeader = request.headers.authorization;
  if(!authHeader){
    throw new AppError("Token não fornecido", 401);
  }
  const [, tokenString] = authHeader.split(' ');
  const token = String(tokenString).replaceAll('"', '');
  try{
    const {sub: user_id } = verify(token, authConfig.jwt.secret);
    request.user = {
      id: Number(user_id),
    }
    return next();
  }catch(err){
    throw new AppError("Token inválido.")
  }
}
module.exports = ensureAuthenticated;