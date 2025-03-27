import mysql from 'promise-mysql';
import keys from './keys';

// Configuración mejorada para Clever Cloud
const pool = mysql.createPool({
  ...keys.database,
  ssl: {
    rejectUnauthorized: false // Obligatorio para Clever Cloud
  },
  connectionLimit: 10,
  connectTimeout: 10000 // 10 segundos de timeout
});

// Verificación de conexión más robusta
pool.getConnection()
  .then(connection => {
    console.log('✅ DB is Connected');
    connection.release(); // Mejor práctica para liberar conexión
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    // Detalles específicos para diagnóstico
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Revisa: Credenciales/IPs en Clever Cloud');
    }
    if (err.code === 'ETIMEDOUT') {
      console.error('Revisa: Whitelist de IPs en Clever Cloud');
    }
  });

export default pool;