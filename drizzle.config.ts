import 'dotenv/config'; // remove this line if you use Node.js v20.6.0 or later
import type { Config } from "drizzle-kit";

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
