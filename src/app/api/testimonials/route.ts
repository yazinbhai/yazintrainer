import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { createClient } from "@vercel/kv";

const DEFAULT_TESTIMONIALS = [
  {
    id: "default-t1",
    quote: "Yazin’s approach completely changed how our sales team communicates. We moved past generic pitches into genuine, strategic conversation. It directly impacted our Q3 closing rates.",
    author: "Rahul V.",
    role: "VP of Sales, Regional Tech",
  },
  {
    id: "default-t2",
    quote: "The IELTS mastery program isn't just about passing a test. It's about structuring thought. I achieved a Band 8.5 because I was taught how to think natively, not just translate.",
    author: "Sneha M.",
    role: "Post-grad applicant, UK",
  },
  {
    id: "default-t3",
    quote: "We brought Yazin Trainer in to bridge the gap between our fresh campus hires and our client-facing realities. The transformation in their email etiquette and meeting presence was stark.",
    author: "Director of HR",
    role: "Enterprise Consultancy Firm",
  },
];

const getTestimonialsJsonPath = () => {
  return path.join(process.cwd(), "public", "uploads", "testimonials.json");
};

// Check if prefixed testimonial KV is configured
const getTestimonialKvClient = () => {
  const url = process.env.testimonial_KV_REST_API_URL || 
              process.env.testimonial_KV_URL || 
              process.env.testimonial_REDIS_URL ||
              process.env.KV_REST_API_URL || 
              process.env.KV_URL ||
              process.env.UPSTASH_REDIS_REST_URL; // Fallback to global KV if prefixed is not found
              
  const token = process.env.testimonial_KV_REST_API_TOKEN || 
                process.env.KV_REST_API_TOKEN ||
                process.env.UPSTASH_REDIS_REST_TOKEN;
                
  if (url && token) {
    return createClient({ url, token });
  }
  return null;
};

export async function GET() {
  try {
    const kvClient = getTestimonialKvClient();
    if (kvClient) {
      let items = await kvClient.get<any[]>("testimonials");
      if (!items) {
        const jsonPath = getTestimonialsJsonPath();
        if (existsSync(jsonPath)) {
          try {
            const fileContent = await readFile(jsonPath, "utf-8");
            items = JSON.parse(fileContent);
          } catch (e) {
            items = DEFAULT_TESTIMONIALS;
          }
        } else {
          items = DEFAULT_TESTIMONIALS;
        }
        await kvClient.set("testimonials", items);
      }
      return NextResponse.json(items);
    } else {
      // Local fallback
      const jsonPath = getTestimonialsJsonPath();
      if (!existsSync(jsonPath)) {
        return NextResponse.json(DEFAULT_TESTIMONIALS);
      }
      const fileContent = await readFile(jsonPath, "utf-8");
      return NextResponse.json(JSON.parse(fileContent));
    }
  } catch (error: any) {
    console.error("GET testimonials error:", error);
    return NextResponse.json({ error: "Failed to read testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "2501261986")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, quote, author, role } = await req.json();

    if (!quote || !author || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let items: any[] = [];
    const kvClient = getTestimonialKvClient();

    // 1. Get the items
    if (kvClient) {
      items = await kvClient.get<any[]>("testimonials") || [];
    } else {
      // Local fallback
      const jsonPath = getTestimonialsJsonPath();
      if (existsSync(jsonPath)) {
        const fileContent = await readFile(jsonPath, "utf-8");
        try {
          items = JSON.parse(fileContent);
        } catch (e) {
          items = [...DEFAULT_TESTIMONIALS];
        }
      } else {
        items = [...DEFAULT_TESTIMONIALS];
      }
    }

    let savedItem;

    if (id) {
      // Edit mode
      items = items.map((item) => {
        if (item.id === id) {
          savedItem = { id, quote, author, role };
          return savedItem;
        }
        return item;
      });
      
      if (!savedItem) {
        return NextResponse.json({ error: "Testimonial not found for editing" }, { status: 404 });
      }
    } else {
      // Create mode
      savedItem = {
        id: Date.now().toString(),
        quote,
        author,
        role,
      };
      items.push(savedItem); // Append to list
    }

    // 2. Save items
    if (kvClient) {
      await kvClient.set("testimonials", items);
    } else {
      // Local fallback
      const jsonPath = getTestimonialsJsonPath();
      const uploadDir = path.dirname(jsonPath);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(jsonPath, JSON.stringify(items, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, item: savedItem });
  } catch (error: any) {
    console.error("POST testimonial error:", error);
    return NextResponse.json({ error: error.message || "Failed to save testimonial" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    if (password !== (process.env.ADMIN_PASSWORD || "2501261986")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let items: any[] = [];
    const kvClient = getTestimonialKvClient();

    // 1. Get items
    if (kvClient) {
      items = await kvClient.get<any[]>("testimonials") || [];
    } else {
      // Local fallback
      const jsonPath = getTestimonialsJsonPath();
      if (!existsSync(jsonPath)) {
        return NextResponse.json({ error: "Testimonials index not found" }, { status: 404 });
      }
      const fileContent = await readFile(jsonPath, "utf-8");
      items = JSON.parse(fileContent);
    }

    const exists = items.some((item: any) => item.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const updatedItems = items.filter((item: any) => item.id !== id);

    // 2. Save items
    if (kvClient) {
      await kvClient.set("testimonials", updatedItems);
    } else {
      // Local fallback
      const jsonPath = getTestimonialsJsonPath();
      await writeFile(jsonPath, JSON.stringify(updatedItems, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE testimonial error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
