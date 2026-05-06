import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const KB_DIR = path.join(ROOT, "knowledge_base");
const CACHE_DIR = path.join(KB_DIR, ".cache");
const INDEX_PATH = path.join(CACHE_DIR, "embeddings.json");
const MODEL = "text-embedding-3-small";
const BATCH_SIZE = 20;

function splitByHeadings(markdown, source) {
  const lines = markdown.split("\n");
  const chunks = [];
  let currentHeading = "";
  let currentLines = [];
  let chunkIndex = 0;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      if (currentLines.length > 0) {
        const text = currentLines.join("\n").trim();
        if (text.length > 0) {
          chunks.push({
            id: `${source}#${chunkIndex}`,
            source,
            heading: currentHeading || source,
            content: text,
          });
          chunkIndex++;
        }
      }
      currentHeading = h2Match[1].trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const text = currentLines.join("\n").trim();
    if (text.length > 0) {
      chunks.push({
        id: `${source}#${chunkIndex}`,
        source,
        heading: currentHeading || source,
        content: text,
      });
    }
  }

  return chunks;
}

function loadAllChunks() {
  const files = fs
    .readdirSync(KB_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const chunks = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(KB_DIR, file), "utf-8");
    chunks.push(...splitByHeadings(content, file));
  }
  return chunks;
}

async function main() {
  // Load .env.local manually
  const envPath = path.join(ROOT, ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const value = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set. Add it to .env.local or export it.");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  console.log("Loading knowledge base...");
  const chunks = loadAllChunks();
  const sources = new Set(chunks.map((c) => c.source));
  console.log(`Found ${chunks.length} chunks from ${sources.size} files`);

  const entries = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const inputs = batch.map((c) => `${c.heading}\n${c.content}`);

    console.log(
      `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`
    );

    const response = await openai.embeddings.create({
      model: MODEL,
      input: inputs,
    });

    for (let j = 0; j < batch.length; j++) {
      entries.push({
        ...batch[j],
        embedding: response.data[j].embedding,
      });
    }
  }

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const index = {
    model: MODEL,
    createdAt: new Date().toISOString(),
    entries,
  };

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index));
  const sizeKB = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(1);
  console.log(`\nDone! Index saved to ${INDEX_PATH}`);
  console.log(`Entries: ${entries.length}, Size: ${sizeKB} KB`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
