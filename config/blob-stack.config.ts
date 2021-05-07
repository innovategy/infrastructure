import * as dotenv from 'dotenv';
dotenv.config();

interface config {
  Name: string;
}

export const s3Config: config = {
  Name: process.env.S3_BUCKET_NAME ?? 'bucket',
};
