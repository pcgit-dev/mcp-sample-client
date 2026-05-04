# MCP Sample Client

A TypeScript client that connects to an MCP (Model Context Protocol) server and demonstrates tool invocation using the `@modelcontextprotocol/sdk`.

## What it does

Connects to an MCP server running at `http://localhost:3000/mcp` and exercises two tools:

- **calculator** — performs add, subtract, multiply, and divide operations
- **currency_converter** — converts amounts between currency pairs (USD, EUR, GBP, INR, JPY, AED, etc.)

Both tools include error-case demonstrations (division by zero, unknown currency code).

## Prerequisites

- Node.js 18+
- An MCP server running at `http://localhost:3000/mcp` that exposes the `calculator` and `currency_converter` tools

## Installation

```bash
npm install
```

## Usage

Build and run in one step:

```bash
npm run dev
```

Or build first, then run separately:

```bash
npm run build
npm start
```

## Sample cURL requests

The MCP server accepts JSON-RPC 2.0 requests over HTTP. You need to initialise a session first, then call tools.

### 1. Initialise session

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "clientInfo": { "name": "curl-client", "version": "1.0.0" },
      "capabilities": {}
    }
  }'
```

> The response will include a `Mcp-Session-Id` header. Copy that value and pass it as `-H "Mcp-Session-Id: <id>"` in every subsequent request.

---

### 2. Calculator tool

**Add**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "calculator",
      "arguments": { "operation": "add", "a": 42, "b": 58 }
    }
  }'
```

**Subtract**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "calculator",
      "arguments": { "operation": "subtract", "a": 100, "b": 37 }
    }
  }'
```

**Multiply**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "calculator",
      "arguments": { "operation": "multiply", "a": 12, "b": 9 }
    }
  }'
```

**Divide**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "calculator",
      "arguments": { "operation": "divide", "a": 144, "b": 12 }
    }
  }'
```

**Divide by zero (error case)**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "calculator",
      "arguments": { "operation": "divide", "a": 10, "b": 0 }
    }
  }'
```

---

### 3. Currency converter tool

**USD → INR**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "currency_converter",
      "arguments": { "amount": 100, "from": "USD", "to": "INR" }
    }
  }'
```

**EUR → GBP**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 8,
    "method": "tools/call",
    "params": {
      "name": "currency_converter",
      "arguments": { "amount": 500, "from": "EUR", "to": "GBP" }
    }
  }'
```

**JPY → USD**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "tools/call",
    "params": {
      "name": "currency_converter",
      "arguments": { "amount": 1000, "from": "JPY", "to": "USD" }
    }
  }'
```

**AED → EUR**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 10,
    "method": "tools/call",
    "params": {
      "name": "currency_converter",
      "arguments": { "amount": 250, "from": "AED", "to": "EUR" }
    }
  }'
```

**Unknown currency (error case)**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 11,
    "method": "tools/call",
    "params": {
      "name": "currency_converter",
      "arguments": { "amount": 100, "from": "USD", "to": "XYZ" }
    }
  }'
```

---

## Project structure

```
src/
  index.ts   # client entry point — connects, lists tools, runs demos
dist/        # compiled output (generated by tsc)
```

## Tech stack

| Package | Purpose |
|---------|---------|
| `@modelcontextprotocol/sdk` | MCP client & StreamableHTTP transport |
| `typescript` | Type-safe compilation |
| `@types/node` | Node.js type definitions |
