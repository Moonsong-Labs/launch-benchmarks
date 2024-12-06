import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api";
import { spawn } from "child_process";
import assert from "assert";

const args = ["--no-hardware-benchmarks",
    "--no-telemetry",
    "--reserved-only",
    "--rpc-cors=all",
    "--unsafe-force-node-key-generation",
    "--no-grandpa",
    "--ethapi=txpool",
    // "--wasmtime-precompiled=wasm",
    "--sealing=manual",
    "--force-authoring",
    "--no-prometheus",
    "--alice",
    "--chain=moonbase-dev",
    "--tmp",]

const proc = spawn("./moonbeam", args);

if (!proc.stderr) {
    throw new Error("Failed to get stderr from process");
}

const phrase = 'Development Service Ready'
let buffer = ''

proc.stderr.on('data', (data: Buffer) => {
    const decoded = data.toString()
    buffer += decoded

    if (buffer.includes(phrase)) {
        console.log("Found phrase")
    }
});

await new Promise<void>((resolve) => {
    proc.stderr!.on('data', (data: Buffer) => {
        if (buffer.includes(phrase)) {
            resolve();
        }
    });
});

const api = await ApiPromise.create({
    provider: new WsProvider("ws://127.0.0.1:9944"),
    throwOnConnect: false,
    isPedantic: false,
    throwOnUnknown: false
});

assert.strictEqual(api.consts.system.version.specName.toString(), "moonbase");

await api.disconnect();
proc.kill();
await new Promise((resolve) => proc.on('exit', resolve));