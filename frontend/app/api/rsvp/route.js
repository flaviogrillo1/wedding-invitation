import { NextResponse } from "next/server";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_RSVP_TABLE = process.env.AIRTABLE_RSVP_TABLE || "RSVP";
const AIRTABLE_PERSON_TABLE = process.env.AIRTABLE_PERSON_TABLE || "Personas";
const AIRTABLE_PERSON_LINK_FIELD = process.env.AIRTABLE_PERSON_LINK_FIELD || "RSVP";

async function airtableRequest(table, payload) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Airtable error (${res.status}): ${detail}`);
  }

  return res.json();
}

function validatePayload(body) {
  const errors = [];
  if (!body.contactName?.trim()) errors.push("contactName requerido");

  if (body.attendance === "yes") {
    if (!Number.isFinite(body.totalPeople) || body.totalPeople < 1) {
      errors.push("totalPeople debe ser >= 1");
    }
    if (!Array.isArray(body.persons) || body.persons.length < body.totalPeople) {
      errors.push("persons incompleto");
    }
    if (body.busNeeded && (!body.busOrigin || !body.busTrip)) {
      errors.push("Origen y trayecto de bus requeridos");
    }
  }

  return errors;
}

export async function POST(request) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return NextResponse.json({ error: "Airtable env vars missing" }, { status: 500 });
  }

  const data = await request.json();
  const errors = validatePayload(data);
  if (errors.length) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const attendanceLabel = data.attendance === "yes" ? "Sí" : "No";
  const busLabel = data.busNeeded ? "Sí" : "No";

  const rsvpFields = {
    Contacto: data.contactName || "",
    Email: data.contactEmail || "",
    Asisten: attendanceLabel,
    Bus: busLabel,
    Mensaje: data.message || "",
  };

  if (data.attendance === "yes") {
    rsvpFields["Nº Personas"] = data.totalPeople;
    if (data.busNeeded) {
      rsvpFields["Origen bus"] = data.busOrigin || "";
      rsvpFields["Trayecto bus"] = data.busTrip || "";
    }
  } else {
    // No asistencia: no enviamos origen/trayecto para evitar opciones vacías
    rsvpFields["Nº Personas"] = 0;
  }

  try {
    const rsvpResponse = await airtableRequest(AIRTABLE_RSVP_TABLE, { fields: rsvpFields });
    const rsvpId = rsvpResponse.id;

    if (data.attendance === "yes" && Array.isArray(data.persons) && data.persons.length) {
      const personsPayload = data.persons.map((person) => ({
        fields: {
          "Nombre completo": person.name || "",
          "Tiene alergias": Boolean(person.hasAllergies),
          Alergias: person.hasAllergies ? person.allergies || "" : "",
          [AIRTABLE_PERSON_LINK_FIELD]: [rsvpId],
        },
      }));

      // Airtable supports batch creation via records array
      await airtableRequest(AIRTABLE_PERSON_TABLE, { records: personsPayload });
    }

    return NextResponse.json({ id: rsvpId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save RSVP", detail: error.message }, { status: 500 });
  }
}
