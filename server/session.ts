import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

const PostgresStore = connectPgSimple(session);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const sessionSettings: session.SessionOptions = {
  store: new PostgresStore({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "monkey-studio-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};
