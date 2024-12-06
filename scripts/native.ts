import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api";
import { expect} from "bun:test"

const args = ["--no-hardware-benchmarks",
    "--no-telemetry",
    "--reserved-only",
    "--rpc-cors=all",
    // "--wasmtime-precompiled=wasm",
    "--unsafe-force-node-key-generation",
    "--no-grandpa",
    "--sealing=manual",
    "--force-authoring",
    "--ethapi=txpool",
    "--no-prometheus",
    "--alice",
    "--chain=moonbase-dev",
    "--tmp",]

const proc = Bun.spawn(["./moonbeam", ...args], {
    stderr: "pipe",
})

const stream = proc.stderr.getReader()
const decoder = new TextDecoder()
const phrase = 'Development Service Ready'
let buffer = ''

while (true) {
    const { value } = await stream.read()

    const decoded = decoder.decode(value)
    buffer += decoded

    if (decoded.includes(phrase)) {
        console.log("Found phrase")
        break
    }
}

const api = await ApiPromise.create({
    provider: new WsProvider("ws://127.0.0.1:9944"),
    throwOnConnect: false,
    isPedantic: false,
    throwOnUnknown: false
});

expect(api.consts.system.version.specName.toString()).toBe("moonbase");

await api.disconnect();
proc.kill();
await proc.exited