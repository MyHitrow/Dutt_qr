import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STORE_PATH = path.join("/tmp", "dut_menu_store_v1.json");

// Memory cache fallback
let memoryStore: any = null;

function readStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      memoryStore = JSON.parse(raw);
      return memoryStore;
    }
  } catch (err) {
    console.error("Error reading menu store:", err);
  }
  return null;
}

function writeStore(data: any) {
  memoryStore = data;
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data), "utf-8");
  } catch (err) {
    console.error("Error writing menu store:", err);
  }
}

export async function GET() {
  const store = readStore();
  return NextResponse.json({ success: true, data: store });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeStore(body);
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  memoryStore = null;
  try {
    if (fs.existsSync(STORE_PATH)) {
      fs.unlinkSync(STORE_PATH);
    }
  } catch {}
  return NextResponse.json({ success: true });
}
