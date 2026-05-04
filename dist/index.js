import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
const SERVER_URL = "http://localhost:3000/mcp";
// ── helpers ──────────────────────────────────────────────────────────────────
function printHeader(title) {
    console.log(`\n${"─".repeat(50)}`);
    console.log(` ${title}`);
    console.log("─".repeat(50));
}
function extractText(result) {
    const r = result;
    return r?.content?.map((c) => c.text).join("\n") ?? JSON.stringify(result);
}
// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
    // 1. Connect
    const transport = new StreamableHTTPClientTransport(new URL(SERVER_URL));
    const client = new Client({ name: "mcp-sample-client", version: "1.0.0" });
    console.log(`Connecting to MCP server at ${SERVER_URL} ...`);
    await client.connect(transport);
    console.log("Connected!");
    // 2. List available tools
    printHeader("Available Tools");
    const { tools } = await client.listTools();
    tools.forEach((t) => console.log(`  • ${t.name} — ${t.description}`));
    // 3. Calculator demos
    printHeader("Calculator");
    const calcCases = [
        { operation: "add", a: 42, b: 58 },
        { operation: "subtract", a: 100, b: 37 },
        { operation: "multiply", a: 12, b: 9 },
        { operation: "divide", a: 144, b: 12 },
        { operation: "divide", a: 10, b: 0 }, // error case
    ];
    for (const args of calcCases) {
        const result = await client.callTool({ name: "calculator", arguments: args });
        console.log(` ${extractText(result)}`);
    }
    // 4. Currency converter demos
    printHeader("Currency Converter");
    const fxCases = [
        { amount: 100, from: "USD", to: "INR" },
        { amount: 500, from: "EUR", to: "GBP" },
        { amount: 1000, from: "JPY", to: "USD" },
        { amount: 250, from: "AED", to: "EUR" },
        { amount: 100, from: "USD", to: "XYZ" }, // error case
    ];
    for (const args of fxCases) {
        const result = await client.callTool({ name: "currency_converter", arguments: args });
        console.log(` ${extractText(result)}\n`);
    }
    // 5. Disconnect
    await client.close();
    console.log("─".repeat(50));
    console.log("Done. Connection closed.");
}
main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
