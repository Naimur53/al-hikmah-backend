import bcrypt from 'bcrypt';
import config from '../config';
const createBycryptPassword = async (password: string): Promise<string> => {
  console.log('password', password);
  const bcryptPass = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt_rounds),
  );

  return bcryptPass;
};
export default createBycryptPassword;
