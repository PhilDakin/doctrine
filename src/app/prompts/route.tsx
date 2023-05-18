import { NextResponse, type NextRequest } from "next/server";
import { EXTRACT_BASE } from "./prompts";

// TODO (pdakin): Confirm this is a private API.

export async function GET(request: NextRequest) {
  console.log(request.body);
  const url = new URL(request.url);
  const prompt = new URLSearchParams(url.searchParams).get("name");
  // TODO (pdakin): Use prompt to select correct base.
  return NextResponse.json({ base: EXTRACT_BASE });
}
