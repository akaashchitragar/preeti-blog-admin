import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function GET() {
  const auth = imagekit.getAuthenticationParameters();
  return NextResponse.json(auth);
}
