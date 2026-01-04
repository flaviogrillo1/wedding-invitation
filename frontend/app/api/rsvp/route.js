import { NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "RSVP";

export async function POST(request) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return NextResponse.json({ error: "Airtable env vars missing" }, { status: 500 });
  }

  const data = await request.json();
  const fields = {
    Name: data.name || "",
    Email: data.email || "",
    Attendance: data.attendance || "",
    Guests: Number.isFinite(data.guests) ? data.guests : 1,
    "Guest Details": data.guestDetails || "",
    Allergies: data.allergies || "",
    Message: data.message || "",
    "Bus From": data.busFrom || "",
    "Bus Direction": data.busDirection || "",
  };

  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json({ id: json.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}
