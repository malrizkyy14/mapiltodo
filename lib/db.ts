import mysql from "mysql2/promise";

const requiredEnvironment = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

for (const key of requiredEnvironment) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is required.`);
  }
}

const ca = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");

const globalForMySQL = globalThis as typeof globalThis & {
  mysqlPool?: mysql.Pool;
};

export const db =
  globalForMySQL.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: Boolean(ca), ...(ca ? { ca } : {}) }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMySQL.mysqlPool = db;
}
