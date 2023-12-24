const { hash } = require('bcryptjs');
const AppError = require('../utils/AppError');

class UserCreateService{
  constructor(userRepository){
    this.userRepository = userRepository;
  }
  async execute({email, name, password}){
    const checkUserExists = await this.userRepository.findByEmail(email);
    if(checkUserExists){
      throw new AppError('Este e-mail já está em uso.')
    }
    const hashedPassword = await hash(password, 8);
    return await this.userRepository.create({email, name, password: hashedPassword});
  }
}
module.exports = UserCreateService;