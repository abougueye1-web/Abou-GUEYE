import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin for server-side access
// Note: In this environment, we use the same config as client
initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = getFirestore();
// Set database ID if provided
if (firebaseConfig.firestoreDatabaseId) {
  // Note: Admin SDK handles databaseId differently depending on version
  // For simplicity in this environment, we assume default or handled by projectId
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve ads.txt dynamically from Firestore
  app.get("/ads.txt", async (req, res) => {
    try {
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
      const articles = await db.collection("articles").where("published", "==", true).get();
      const visas = await db.collection("visa_guides").get();
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${process.env.APP_URL}/</loc><priority>1.0</priority></url>
  <url><loc>${process.env.APP_URL}/visas</loc><priority>0.8</priority></url>
  <url><loc>${process.env.APP_URL}/jobs</loc><priority>0.8</priority></url>
  <url><loc>${process.env.APP_URL}/blog</loc><priority>0.8</priority></url>`;

      articles.forEach(doc => {
        xml += `\n  <url><loc>${process.env.APP_URL}/blog/${doc.data().slug}</loc><priority>0.6</priority></url>`;
      });

      visas.forEach(doc => {
        xml += `\n  <url><loc>${process.env.APP_URL}/visas/${doc.data().slug}</loc><priority>0.6</priority></url>`;
      });

      xml += "\n</urlset>";
      res.type("application/xml").send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
