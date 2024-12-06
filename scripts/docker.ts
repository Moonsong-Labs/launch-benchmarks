import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api";
import Docker from 'dockerode';
import assert from "assert";

const args = ["--no-hardware-benchmarks",
    "--no-telemetry",
    "--reserved-only",
    "--rpc-cors=all",
    "--unsafe-force-node-key-generation",
    "--no-grandpa",
    "--ethapi=txpool",
    "--sealing=manual",
    "--force-authoring",
    "--rpc-external",
    "--no-prometheus",
    "--alice",
    "--chain=moonbase-dev",
    "--tmp",
];

const docker = new Docker();
const container = await docker.createContainer({
    Image: 'moonbeamfoundation/moonbeam',
    Cmd: args,
    ExposedPorts: {
        '9944/tcp': {}
    },
    HostConfig: {
        PortBindings: {
            '9944/tcp': [{ HostPort: '9944' }]
        }
    }
});

await container.start();

const logs = await container.logs({
    follow: true,
    stdout: true,
    stderr: true
});

const phrase = 'Development Service Ready';
for await (const chunk of logs) {
    if (chunk.toString().includes(phrase)) {
        break;
    }
}


console.log("Node ready!");

const api = await ApiPromise.create({
    provider: new WsProvider("ws://127.0.0.1:9944"),
    throwOnConnect: false,
    isPedantic: false,
    throwOnUnknown: false
});

assert.strictEqual(api.consts.system.version.specName.toString(), "moonbase");
console.log("assert passed");

await api.disconnect();
console.log("disconnected");
await container.stop();
console.log("container stopped");

await container.remove({ v: true });