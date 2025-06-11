// src/db.ts
import dotenv from 'dotenv';
import mysql from 'mysql/promise';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT ?? 5432),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

async function verifyConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected');
        client.release();
    } catch (err) {
        console.error('❌ PostgreSQL connection error:', err);
        process.exit(1);
    }
}

verifyConnection();

export default pool;
