import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '..', '.env');

console.log('📁 [Prisma Config] Looking for .env at:', envPath);

const result = dotenv.config({ path: envPath });
// ADD THESE TWO LINES
console.log('📄 [Prisma Config] Parsed keys:', Object.keys(result.parsed || {}));
console.log('📄 [Prisma Config] Parse error:', result.error || 'none');
if (result.error) {
  console.error('❌ [Prisma Config] Failed to load .env file:', result.error.message);
} else {
  console.log('✅ [Prisma Config] .env file loaded successfully');
}

console.log('🔍 [Prisma Config] DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 [Prisma Config] DATABASE_URL value:', 
  process.env.DATABASE_URL 
    ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') // hide password
    : 'NOT FOUND ❌'
);

let prisma;

try {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  console.log('✅ [Prisma Config] PrismaClient initialized successfully');
} catch (error) {
  console.error('❌ [Prisma Config] Failed to initialize PrismaClient:', error.message);
  process.exit(1);
}

export default prisma;