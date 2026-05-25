import { Client } from "@notionhq/client";
import type { CarListing } from "@/types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

function extractText(prop: any): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.[0]?.plain_text ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "number") return prop.number?.toString() ?? "";
  if (prop.type === "checkbox") return prop.checkbox ? "true" : "false";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "multi_select") return prop.multi_select?.map((s: any) => s.name).join(", ") ?? "";
  return "";
}

function mapPageToCar(page: any): CarListing {
  const p = page.properties;
  const cover = page.cover;
  let imageUrl: string | undefined;

  if (cover?.type === "external") imageUrl = cover.external?.url;
  else if (cover?.type === "file") imageUrl = cover.file?.url;
  else if (p.Image?.type === "url") imageUrl = p.Image?.url ?? undefined;
  else if (p.Photo?.type === "files" && p.Photo.files?.[0]) {
    const f = p.Photo.files[0];
    imageUrl = f.type === "external" ? f.external?.url : f.file?.url;
  }

  const featuresRaw = extractText(p.Features ?? p.features ?? p.Amenities);
  const features = featuresRaw ? featuresRaw.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

  return {
    id: page.id,
    notionId: page.id,
    name: extractText(p.Name ?? p.Title ?? p.Car),
    brand: extractText(p.Brand ?? p.Make),
    model: extractText(p.Model),
    year: parseInt(extractText(p.Year)) || new Date().getFullYear(),
    category: extractText(p.Category ?? p.Type) || "ECONOMY",
    pricePerDay: parseFloat(extractText(p["Price Per Day"] ?? p.Price ?? p.PricePerDay)) || 0,
    imageUrl,
    description: extractText(p.Description),
    seats: parseInt(extractText(p.Seats)) || 5,
    transmission: extractText(p.Transmission) || "AUTOMATIC",
    fuel: extractText(p.Fuel ?? p["Fuel Type"]) || "GASOLINE",
    available: extractText(p.Available ?? p.Status) !== "false",
    features,
  };
}

export async function getAvailableCars(limit?: number): Promise<CarListing[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        or: [
          { property: "Available", checkbox: { equals: true } },
          { property: "Status", select: { equals: "Available" } },
        ],
      },
      page_size: limit ?? 100,
    });
    return response.results.map(mapPageToCar);
  } catch (err) {
    console.error("Notion error:", err);
    return [];
  }
}

export async function getCarById(id: string): Promise<CarListing | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    return mapPageToCar(page);
  } catch {
    return null;
  }
}
