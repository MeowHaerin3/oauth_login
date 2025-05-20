require('dotenv').config({ path: '../.env' });
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('./config/passport');

const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true // Allow cookies with CORS
}));

// Body parser middleware
app.use(express.json());

// Redis setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Redis session store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'oauth_login:'
});

// Express session
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hrs
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Hello! Use /auth/google to login.'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);