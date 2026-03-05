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

startServer();
