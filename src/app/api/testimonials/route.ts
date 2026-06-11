import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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

export async function GET() {
  try {
    const jsonPath = getTestimonialsJsonPath();
    if (!existsSync(jsonPath)) {
      return NextResponse.json(DEFAULT_TESTIMONIALS);
    }
    const fileContent = await readFile(jsonPath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error: any) {
    console.error("GET testimonials error:", error);
    return NextResponse.json({ error: "Failed to read testimonials" }, { status: 500 });
  }
}
