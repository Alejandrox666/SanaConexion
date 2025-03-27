// config/database.ts (o donde tengas tu configuración)


export default {
    database: {
        host: process.env.MYSQL_ADDON_HOST || 'byxkfgn533c0gq7wr3zp-mysql.services.clever-cloud.com',
        user: process.env.MYSQL_ADDON_USER || 'ubqrdo4zqgwd7wrj',
        password: process.env.MYSQL_ADDON_PASSWORD || 'os43p0tlkzbTvQ4DEzoY',
        database: process.env.MYSQL_ADDON_DB || 'byxkfgn533c0gq7wr3zp',
        port: Number(process.env.MYSQL_ADDON_PORT) || 3306,
        ssl: {
            rejectUnauthorized: false // Obligatorio para Clever Cloud
        },
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true
    }
}