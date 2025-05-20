// filepath: d:\backend_project\oauth_login\backend\drizzle.config.js
require('dotenv').config({ path: '../.env' });

module.exports = {  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  }
};
