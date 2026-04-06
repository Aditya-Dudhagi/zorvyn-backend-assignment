import bcrypt from "bcryptjs";

export const hashPassword = async (plainText) => {
  return bcrypt.hash(plainText, 10);
};

export const comparePassword = async (plainText, hashed) => {
  return bcrypt.compare(plainText, hashed);
};
