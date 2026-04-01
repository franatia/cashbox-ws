import * as bcrypt from 'bcrypt';

export const generateHash = async (text: string): Promise<string> => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(text, saltRounds);
    return hashed;
}

export const match = async (text: string, hash: string) : Promise<boolean> => {
    return bcrypt.compare(text, hash);
} 