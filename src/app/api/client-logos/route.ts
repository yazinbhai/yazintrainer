import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { createClient } from "@vercel/kv";

const DEFAULT_LOGOS = [
  {
    id: "logo-1",
    name: "PlanetSpark",
    logoUrl: "",
    category: "EdTech & Communication"
  },
  {
    id: "logo-2",
    name: "Corporetta",
    logoUrl: "",
    category: "Corporate Soft Skills"
  },
  {
    id: "logo-3",
    name: "Jintas Learning",
    logoUrl: "",
    category: "Learning Solutions"
  },
  {
    id: "logo-4",
    name: "British Council",
    logoUrl: "",
    category: "English & Assessment"
  },
  {
    id: "logo-5",
    name: "IDP Education",
    logoUrl: "",
    category: "Global Education & IELTS"
  },
  {
    id: "logo-6",
    name: "ALAP UK",
    logoUrl: "",
    category: "Accreditation"
  }
];

const getClientLogosJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "client-logos.json");
};

const getClientKvClient = () => {
  const url = process.env.client_logos_KV_REST_API_URL || 
              process.env.KV_REST_API_URL || 
              process.env.KV_URL ||
              process.env.UPSTASH_REDIS_REST_URL;
              
  const token = process.env.client_logos_KV_REST_API_TOKEN || 
                process.env.KV_REST_API_TOKEN ||
                process.env.UPSTASH_REDIS_REST_TOKEN;
                
  if (url && token) {
    return createClient({ url, token });
  }
  return null;
};

export async function GET() {
  try {
    const kvClient = getClientKvClient();
    if (kvClient) {
      let items = await kvClient.get<any[]>("client_logos");
      if (!items) {
        const jsonPath = getClientLogosJsonPath();
        if (existsSync(jsonPath)) {
          try {
            const fileContent = await readFile(jsonPath, "utf-8");
            items = JSON.parse(fileContent);
          } catch (e) {
            items = [...DEFAULT_LOGOS];
          }
        } else {
          items = [...DEFAULT_LOGOS];
        }
        await kvClient.set("client_logos", items);
      }
      return NextResponse.json(items);
    }

    // Local JSON Fallback
    const jsonPath = getClientLogosJsonPath();
    if (!existsSync(jsonPath)) {
      const uploadDir = path.dirname(jsonPath);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(jsonPath, JSON.stringify(DEFAULT_LOGOS, null, 2), "utf-8");
      return NextResponse.json(DEFAULT_LOGOS);
    }

    const fileContent = await readFile(jsonPath, "utf-8");
    const items = JSON.parse(fileContent);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET client-logos error:", error);
    return NextResponse.json({ error: "Failed to read client logos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "250126")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, logoUrl, category } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    let items: any[] = [];
    const kvClient = getClientKvClient();

    if (kvClient) {
      items = await kvClient.get<any[]>("client_logos") || [];
    } else {
      const jsonPath = getClientLogosJsonPath();
      if (existsSync(jsonPath)) {
        const fileContent = await readFile(jsonPath, "utf-8");
        try {
          items = JSON.parse(fileContent);
        } catch (e) {
          items = [...DEFAULT_LOGOS];
        }
      } else {
        items = [...DEFAULT_LOGOS];
      }
    }

    let savedItem;

    if (id) {
      // Edit mode
      items = items.map((item) => {
        if (item.id === id) {
          savedItem = { id, name, logoUrl: logoUrl || "", category: category || "Partner" };
          return savedItem;
        }
        return item;
      });
      
      if (!savedItem) {
        return NextResponse.json({ error: "Client logo not found for editing" }, { status: 404 });
      }
    } else {
      // Create mode
      savedItem = {
        id: "logo-" + Date.now().toString(),
        name,
        logoUrl: logoUrl || "",
        category: category || "Partner",
      };
      items.push(savedItem);
    }

    if (kvClient) {
      await kvClient.set("client_logos", items);
    } else {
      const jsonPath = getClientLogosJsonPath();
      const uploadDir = path.dirname(jsonPath);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, item: savedItem });
  } catch (error: any) {
    console.error("POST client-logo error:", error);
    return NextResponse.json({ error: error.message || "Failed to save client logo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "250126")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let items: any[] = [];
    const kvClient = getClientKvClient();

    if (kvClient) {
      items = await kvClient.get<any[]>("client_logos") || [];
    } else {
      const jsonPath = getClientLogosJsonPath();
      if (!existsSync(jsonPath)) {
        return NextResponse.json({ error: "Client logos index not found" }, { status: 404 });
      }
      const fileContent = await readFile(jsonPath, "utf-8");
      items = JSON.parse(fileContent);
    }

    const exists = items.some((item: any) => item.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Client logo not found" }, { status: 404 });
    }

    const updatedItems = items.filter((item: any) => item.id !== id);

    if (kvClient) {
      await kvClient.set("client_logos", updatedItems);
    } else {
      const jsonPath = getClientLogosJsonPath();
      await writeFile(jsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error("DELETE client-logo error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete client logo" }, { status: 500 });
  }
}
