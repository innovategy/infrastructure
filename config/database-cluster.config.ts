import * as dotenv from 'dotenv';
dotenv.config();

interface config {
  Name: string;
  Identifier: string;
  Deleteable: boolean;
  BackupRetention: number
}

export const databaseConfig: config = {
  Name: process.env.DB_NAME ?? 'clsdb',
  Identifier: process.env.DB_IDENTIFIER ?? 'identifier',
  Deleteable: process.env.DB_DELETABLE == undefined ? true : Boolean(process.env.DB_DELETABLE),
  BackupRetention: process.env.DB_BACKUP_RETENTION_POLICY == undefined ? 7 : Number(process.env.DB_BACKUP_RETENTION_POLICY),
};
