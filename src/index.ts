import { Hono } from "hono";
import { Database } from "bun:sqlite";

interface Payload {
  fkbr: string
}

// init database
const database = new Database("dog.sqlite", { readwrite: true, create: true })

// TODO: migrations
database.run("CREATE TABLE IF NOT EXISTS test(id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL);")

// init hono app
const app = new Hono();
const port = parseInt(process.env.PORT) || 3000;

// Routing
const home = app.get("/", (c) => {
  return c.json({ message: "Hello World!" });
});

app.get('/test', (c) => {
  return c.json(database.query("SELECT data FROM test").all())
})

app.post('/test', async (c) => {
  const json = await c.req.json<Payload>();

  database.run("INSERT INTO test(data) VALUES (?)", json.fkbr);

  return c.json({ yolo: true })
})

export default {
  port,
  fetch: home.fetch,
};
