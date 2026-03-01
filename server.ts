import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("marketplace.db");

// Initialize Database
db.exec("PRAGMA foreign_keys = ON;");
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    starting_price REAL NOT NULL,
    current_bid REAL DEFAULT 0,
    images TEXT, -- JSON array of image URLs
    seller_whatsapp TEXT NOT NULL,
    seller_notes TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add images column if it doesn't exist (for existing databases)
try {
  db.exec("ALTER TABLE items ADD COLUMN images TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE items ADD COLUMN seller_notes TEXT");
} catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    bidder_name TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items (id)
  );
`);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "azawe";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "q1w2e3r455";

console.log(`Admin credentials initialized: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD.replace(/./g, '*')}`);

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for username: ${username}`);
  
  const trimmedUsername = username?.trim();
  const trimmedPassword = password?.trim();

  if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
    console.log("Login successful");
    res.json({ success: true, token: "admin-token-123" });
  } else {
    console.log("Login failed: Invalid credentials");
    res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
  }
});

app.put("/api/items/:id", (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== "admin-token-123") return res.status(403).json({ error: "غير مصرح لك" });

  const { title, description, starting_price, current_bid, status, seller_notes } = req.body;
  const itemId = req.params.id;

  db.prepare(`
    UPDATE items 
    SET title = ?, description = ?, starting_price = ?, current_bid = ?, status = ?, seller_notes = ?
    WHERE id = ?
  `).run(title, description, starting_price, current_bid, status, seller_notes, itemId);

  const updatedItem = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);
  updatedItem.images = JSON.parse(updatedItem.images || "[]");
  broadcast({ type: "ITEM_UPDATED", item: updatedItem });
  res.json(updatedItem);
});

app.delete("/api/items/:id", (req, res) => {
  const token = req.headers['x-admin-token'];
  const itemId = req.params.id;
  
  console.log(`[DELETE] Request for ID: ${itemId}`);
  console.log(`[DELETE] Token: ${token}`);

  if (!token || token !== "admin-token-123") {
    console.log("[DELETE] Unauthorized");
    return res.status(403).json({ error: "غير مصرح لك - يرجى تسجيل الدخول مجدداً" });
  }
  
  try {
    const id = parseInt(itemId);
    if (isNaN(id)) {
      console.log(`[DELETE] Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "معرف القطعة غير صالح" });
    }

    // Delete bids first manually to be safe
    db.prepare("DELETE FROM bids WHERE item_id = ?").run(id);
    
    // Delete the item
    const result = db.prepare("DELETE FROM items WHERE id = ?").run(id);
    
    if (result.changes > 0) {
      console.log(`[DELETE] Successfully deleted item ${id}`);
      broadcast({ type: "ITEM_DELETED", itemId: id });
      res.json({ success: true });
    } else {
      console.log(`[DELETE] Item ${id} not found in database`);
      res.status(404).json({ error: "القطعة غير موجودة في قاعدة البيانات" });
    }
  } catch (error) {
    console.error("[DELETE] Error:", error);
    res.status(500).json({ error: "حدث خطأ فني أثناء محاولة الحذف" });
  }
});

// Setup Multer for image uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadDir));

// WebSocket handling
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

function broadcast(data: any) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API Routes
app.get("/api/items", (req, res) => {
  const items = db.prepare("SELECT * FROM items ORDER BY created_at DESC").all();
  const parsedItems = items.map((item: any) => ({
    ...item,
    images: JSON.parse(item.images || "[]")
  }));
  res.json(parsedItems);
});

app.get("/api/items/:id", (req, res) => {
  const item: any = db.prepare("SELECT * FROM items WHERE id = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  item.images = JSON.parse(item.images || "[]");
  const bids = db.prepare("SELECT * FROM bids WHERE item_id = ? ORDER BY amount DESC").all(req.params.id);
  res.json({ ...item, bids });
});

app.post("/api/items", upload.array("images", 5), (req, res) => {
  const { title, description, starting_price, seller_whatsapp, seller_notes } = req.body;
  const files = req.files as Express.Multer.File[];
  const images = files ? files.map(f => `/uploads/${f.filename}`) : [];

  const result = db.prepare(`
    INSERT INTO items (title, description, starting_price, current_bid, images, seller_whatsapp, seller_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, starting_price, starting_price, JSON.stringify(images), seller_whatsapp, seller_notes);

  const newItem: any = db.prepare("SELECT * FROM items WHERE id = ?").get(result.lastInsertRowid);
  newItem.images = JSON.parse(newItem.images || "[]");
  broadcast({ type: "ITEM_ADDED", item: newItem });
  res.json(newItem);
});

app.post("/api/items/:id/bid", (req, res) => {
  const { bidder_name, amount } = req.body;
  const itemId = req.params.id;

  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (item.status === 'sold') return res.status(400).json({ error: "Item already sold" });
  if (amount <= item.current_bid) {
    return res.status(400).json({ error: "Bid must be higher than current bid" });
  }

  db.transaction(() => {
    db.prepare("INSERT INTO bids (item_id, bidder_name, amount) VALUES (?, ?, ?)").run(itemId, bidder_name, amount);
    db.prepare("UPDATE items SET current_bid = ? WHERE id = ?").run(amount, itemId);
  })();

  const updatedItem = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);
  broadcast({ type: "BID_PLACED", itemId, amount, bidder_name });
  res.json(updatedItem);
});

app.post("/api/items/:id/buy", (req, res) => {
  const itemId = req.params.id;
  db.prepare("UPDATE items SET status = 'sold' WHERE id = ?").run(itemId);
  const updatedItem = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);
  broadcast({ type: "ITEM_SOLD", itemId });
  res.json(updatedItem);
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  });
}

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
