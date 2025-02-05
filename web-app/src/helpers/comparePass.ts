import bcrypt from "bcryptjs";

/**
 * Compares a plaintext password with a hashed password.
 * @param plaintextPassword - User-provided password.
 * @param hashedPassword - Hashed password from the database.
 * @returns Boolean indicating if the password is correct.
 */
export async function comparePass(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plaintextPassword, hashedPassword);
}
