import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ffdfa1cd/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin Signup Endpoint with User Limit and Email Verification
app.post("/make-server-ffdfa1cd/signup", async (c) => {
  const { email, password, name, year } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  // Use Service Role to check user limit
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Check User Limit (100 Users)
  // We fetch one page of 101 users to see if we hit the limit
  const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 101 });
  
  if (listError) {
      console.error("List users error:", listError);
      return c.json({ error: "System error checking user limit" }, 500);
  }

  if ((userList?.users?.length || 0) >= 100) {
      return c.json({ error: "Registration failed: User limit reached (Max 100 users)." }, 403);
  }

  // 2. Register using Anon Key (Triggers Standard Email Verification)
  // We use the anon key passed from the client or the env var
  const authHeader = c.req.header('Authorization') || '';
  const anonKey = authHeader.replace('Bearer ', '') || Deno.env.get('SUPABASE_ANON_KEY')!;

  const supabaseAnon = createClient(
    Deno.env.get('SUPABASE_URL')!,
    anonKey
  );

  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: { name, year },
      // explicit redirect to ensure they come back to the app
      emailRedirectTo: c.req.header('origin') || 'https://skillx-srm.vercel.app' 
    }
  });

  if (error) {
    console.error("Signup error:", error);
    return c.json({ error: error.message }, 400);
  }

  return c.json({ data });
});

Deno.serve(app.fetch);