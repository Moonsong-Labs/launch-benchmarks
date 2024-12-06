import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api";
import { GenericContainer, Wait } from "testcontainers";
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
    "--rpc-external",
    "--force-authoring",
    "--no-prometheus",
    "--alice",
    "--chain=moonbase-dev",
    "--tmp",]

const phrase = 'Development Service Ready'

const container = await new GenericContainer("moonbeamfoundation/moonbeam")
    .withCommand([...args])
    .withNetworkMode("host")
    .withExposedPorts(9944)
    .withWaitStrategy(Wait.forLogMessage(phrase))
    .start();


const api = await ApiPromise.create({
    provider: new WsProvider("ws://127.0.0.1:9944"),
    throwOnConnect: false,
    isPedantic: false,
    throwOnUnknown: false
});

assert.strictEqual(api.consts.system.version.specName.toString(), "moonbase");

await api.disconnect();
await container.stop({
    remove: true,
    removeVolumes: true
})