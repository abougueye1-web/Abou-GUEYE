import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config safely
const configPath = path.join(__dirname, "firebase-applet-config.json");
let firebaseConfig = { projectId: "" };

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    // Initialize Firebase Admin
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (e) {
    console.error("Error parsing firebase-applet-config.json");
  }
} else {
  console.warn("WARNING: firebase-applet-config.json not found. Database features will be disabled.");
}

const db = firebaseConfig.projectId ? getFirestore() : null;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: !!db,
      env: process.env.NODE_ENV 
    });
  });

  // Serve ads.txt dynamically from Firestore
  app.get("/ads.txt", async (req, res) => {
    try {
      if (!db) return res.type("text/plain").send("");
      const settingsDoc = await db.collection("settings").doc("global").get();
      if (settingsDoc.exists) {
        const data = settingsDoc.data();
        res.type("text/plain").send(data?.adsTxt || "");
      } else {
        res.type("text/plain").send("");
      }
    } catch (error) {
      console.error("Error serving ads.txt:", error);
      res.status(500).send("Error serving ads.txt");
    }
  });

  // Sitemap.xml (Dynamic)
  app.get("/sitemap.xml", async (req, res) => {
    try {
      if (!db) return res.status(500).send("Database not initialized");
      const articles = await db.collection("articles").where("published", "==", true).get();
      const visas = await db.collection("visa_guides").get();
      
      const domain = "https://canadavisaprogram.com";
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${domain}/</loc><priority>1.0</priority></url>
  <url><loc>${domain}/visas</loc><priority>0.8</priority></url>
  <url><loc>${domain}/jobs</loc><priority>0.8</priority></url>
  <url><loc>${domain}/blog</loc><priority>0.8</priority></url>`;

      articles.forEach(doc => {
        xml += `\n  <url><loc>${domain}/blog/${doc.data().slug}</loc><priority>0.6</priority></url>`;
      });

      visas.forEach(doc => {
        xml += `\n  <url><loc>${domain}/visas/${doc.data().slug}</loc><priority>0.6</priority></url>`;
      });

      xml += "\n</urlset>";
      res.type("application/xml").send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // Production vs Development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "dist");
    
    // Check if dist exists
    if (!fs.existsSync(distPath)) {
      console.error("CRITICAL: 'dist' folder not found at", distPath);
      app.get("*", (req, res) => {
        res.status(500).send("Server Error: 'dist' folder is missing. Please run 'npm run build'.");
      });
    } else {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
