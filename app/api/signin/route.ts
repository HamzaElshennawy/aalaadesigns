import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  // Parse the request body to get the username and password
  const { email, password } = await req.json();

  const result =
    await sql`SELECT * FROM users WHERE email = ${email["email"]} AND password = ${password["password"]}`;

  return NextResponse.json(result.rows);
}