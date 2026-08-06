// lib/db.ts
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Sua senha do HeidiSQL (vazia no seu caso)
  database: 'progresso_urbano',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Definimos uma interface para padronizar o que a query recebe
interface QueryProps {
  query: string;
  values?: any[];
}

export async function query({ query, values = [] }: QueryProps) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error: any) {
    console.error("Erro no Banco de Dados:", error.message);
    throw new Error(error.message);
  }
}