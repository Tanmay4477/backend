import bcrypt from "bcrypt";
import config from "config";

export async function hashPassword(password: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(config.get("saltRounds"));
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error in hashing the password")
    }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error) {
        throw new Error("Error Verifying password");
    }
}