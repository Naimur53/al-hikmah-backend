import bcrypt from 'bcrypt';
import config from '../config';
const createBycryptPassword = async (password: string): Promise<string> => {
  const bcryptPass = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt_rounds)
  );

  return bcryptPass;
};
export default createBycryptPassword;
