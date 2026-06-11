import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD || "2501261986";
    
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
