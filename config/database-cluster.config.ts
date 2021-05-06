import * as dotenv from 'dotenv';
dotenv.config();

interface config {
  Name: string;
  Identifier: string;
  Deleteable: boolean;
  BackupRetention: number
}

export const databaseConfig: config = {
  Name: process.env.DB_NAME ?? 'default',
  Identifier: process.env.DB_IDENTIFIER ?? 'identifier',
  Deleteable: process.env.DB_IDENTIFIER == undefined ? true : Boolean(process.env.DB_IDENTIFIER),
  BackupRetention: process.env.DB_IDENTIFIER == undefined ? 7 : Number(process.env.DB_IDENTIFIER),
};
