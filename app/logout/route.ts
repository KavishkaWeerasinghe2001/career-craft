import { destroySession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await destroySession();

  return NextResponse.redirect(new URL("/login", request.url));
}