import test from "node:test";
import assert from "node:assert/strict";
import handler from "../pages/api/procesar.js";

function createMockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test("procesar convierte el nombre a mayúsculas y devuelve timestamp", () => {
  const req = { query: { nombre: "juan" } };
  const res = createMockRes();

  handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.resultado, "Nombre procesado: JUAN");

  // Validamos que exista timestamp
  assert.ok(res.body.timestamp);
  assert.equal(typeof res.body.timestamp, "string");
});

test("procesar maneja nombre ausente", () => {
  const req = { query: {} };
  const res = createMockRes();

  handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.body.resultado.includes("ANÓNIMO"));
});

test("procesar devuelve error 500 cuando nombre es 'error'", () => {
  const req = { query: { nombre: "error" } };
  const res = createMockRes();

  handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: "Error simulado" });
});

test("estructura del JSON es consistente", () => {
  const req = { query: { nombre: "ana" } };
  const res = createMockRes();

  handler(req, res);

  assert.equal(typeof res.body.resultado, "string");
  assert.equal(typeof res.body.timestamp, "string");
});

