import { NextResponse, type NextRequest } from "next/server";
import { EXTRACT_BASE, RANK_BASE, REWRITE_BASE } from "./prompts";

// TODO (pdakin): Confirm this is a private API.

const PROMPT_TO_BASE: { [key: string]: string } = {
  extract: EXTRACT_BASE,
  rank: RANK_BASE,
  rewrite: REWRITE_BASE,
};

export async function GET(request: NextRequest) {
  console.log(request.body);
  const url = new URL(request.url);
  const prompt = new URLSearchParams(url.searchParams).get("name");
  if (!prompt) {
    // TODO (pdakin): This should be an error but given private API not too worried about it.
    return NextResponse.json({ base: "unknown" });
  }
  // TODO (pdakin): Use prompt to select correct base.
  return NextResponse.json({ base: PROMPT_TO_BASE[prompt] });
}
