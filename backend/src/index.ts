import express from "express";
import cors from "cors";
import pool from "./db";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const app = express();

app.use(cors());
app.use(express.json());

const asyncHandler = (
  fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>
) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Clients
app.get(
  "/clients",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, city, DATE_FORMAT(joined_at, '%Y-%m-%d') AS joinedAt
       FROM clients
       ORDER BY id`
    );
    res.json(rows);
  })
);

app.get(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, city, DATE_FORMAT(joined_at, '%Y-%m-%d') AS joinedAt
       FROM clients
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json(rows[0]);
  })
);

app.post(
  "/clients",
  asyncHandler(async (req, res) => {
    const { name, email, city, joinedAt } = req.body as {
      name?: string;
      email?: string;
      city?: string;
      joinedAt?: string;
    };

    if (!name || !email || !city || !joinedAt) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO clients (name, email, city, joined_at) VALUES (?, ?, ?, ?)`
      ,
      [name, email, city, joinedAt]
    );

    res.status(201).json({ id: result.insertId, name, email, city, joinedAt });
  })
);

app.put(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, city, joinedAt } = req.body as {
      name?: string;
      email?: string;
      city?: string;
      joinedAt?: string;
    };

    if (!name || !email || !city || !joinedAt) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE clients SET name = ?, email = ?, city = ?, joined_at = ? WHERE id = ?`,
      [name, email, city, joinedAt, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.json({ id, name, email, city, joinedAt });
  })
);

app.delete(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM clients WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    res.status(204).send();
  })
);

// Relations
app.get(
  "/relations",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, parrain_id AS parrainId, filleul_id AS filleulId
       FROM relations
       ORDER BY id`
    );
    res.json(rows);
  })
);

app.post(
  "/relations",
  asyncHandler(async (req, res) => {
    const { parrainId, filleulId } = req.body as {
      parrainId?: number;
      filleulId?: number;
    };

    if (!parrainId || !filleulId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO relations (parrain_id, filleul_id) VALUES (?, ?)`,
      [parrainId, filleulId]
    );

    res.status(201).json({ id: result.insertId, parrainId, filleulId });
  })
);

app.delete(
  "/relations/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM relations WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Relation not found" });
      return;
    }

    res.status(204).send();
  })
);

// Purchases
app.get(
  "/purchases",
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, client_id AS clientId, amount, DATE_FORMAT(date, '%Y-%m-%d') AS date
       FROM purchases
       ORDER BY id`
    );
    res.json(rows);
  })
);

app.post(
  "/purchases",
  asyncHandler(async (req, res) => {
    const { clientId, amount, date } = req.body as {
      clientId?: number;
      amount?: number;
      date?: string;
    };

    if (!clientId || amount === undefined || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO purchases (client_id, amount, date) VALUES (?, ?, ?)`,
      [clientId, amount, date]
    );

    res.status(201).json({ id: result.insertId, clientId, amount, date });
  })
);

app.delete(
  "/purchases/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM purchases WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }

    res.status(204).send();
  })
);

// Helpers pour l'app
app.get(
  "/clients/:id/purchases",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, client_id AS clientId, amount, DATE_FORMAT(date, '%Y-%m-%d') AS date
       FROM purchases
       WHERE client_id = ?
       ORDER BY date DESC`,
      [id]
    );
    res.json(rows);
  })
);

app.get(
  "/clients/:id/filleuls",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.id, c.name, c.email, c.city, DATE_FORMAT(c.joined_at, '%Y-%m-%d') AS joinedAt
       FROM relations r
       INNER JOIN clients c ON c.id = r.filleul_id
       WHERE r.parrain_id = ?
       ORDER BY c.id`,
      [id]
    );
    res.json(rows);
  })
);

// Erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
