# Moonbeam Node Start Benchmark

This repository contains benchmarks for measuring the startup time of a Moonbeam node using different JavaScript/TypeScript runtimes.

## Prerequisites

1. Install Node.js v23

```bash
# Using nvm (recommended)
nvm install 23
nvm use 23
```

2. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

3. Install Hyperfine
```bash
# On Ubuntu/Debian
sudo apt-get install hyperfine

# On macOS
brew install hyperfine
```

## Download Moonbeam Node

Download the latest Moonbeam binary from the official releases:

```bash
# Download latest binary (example for Linux)
wget https://github.com/moonbeam-foundation/moonbeam/releases/latest/download/moonbeam

# Make it executable
chmod +x moonbeam
```

> [!NOTE]  
> The `moonbeam` binary is already in `.gitignore`.

## Setup

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Compile the TypeScript:

```bash
bun run compile
```

## Running Benchmarks

### Individual Runs

To run the native benchmarks individually:

1. Using Bun:

```bash
bun run native
```

2. Using Node:

```bash
bun run native:node
```

3. Using Docker with Bun:

```bash
bun run docker
```

4. Using Docker with Node:

```bash
bun run docker:node
```

5. Using Testcontainers with Node:

```bash
node --import tsx scripts/testcontainers.ts
```

### Running Full Benchmark Suite

To run the complete benchmark comparison (includes all methods):

```bash
bun run bench
```

This will compare the following implementations:

- Native implementation with Bun
- Native implementation with Node
- Docker implementation with Node
- Docker implementation with Bun
- Testcontainers implementation with Node

## Docker Implementation

The project includes multiple Docker-based implementations:

1. **Direct Docker API**: Uses the `dockerode` package to directly interact with the Docker daemon. This implementation can be found in `scripts/docker.ts`.

2. **Testcontainers**: Uses the `testcontainers` package which provides a more testing-oriented approach to container management. This implementation can be found in `scripts/testcontainers.ts`.

Both implementations:

- Pull and run the `moonbeamfoundation/moonbeam` container
- Configure the necessary ports (9944)
- Set up the required node arguments
- Handle container lifecycle management

### Prerequisites for Docker

1. Install Docker on your system
2. Make sure the Docker daemon is running
3. Ensure your user has permissions to interact with Docker

### Docker Commands

To manage Docker containers manually:

```bash
# Pull the Moonbeam image
docker pull moonbeamfoundation/moonbeam

# List running containers
docker ps

# Stop all running containers (if needed)
docker stop $(docker ps -q)
```

## Latest Benchmark Results

```bash
Benchmark 1: bun
  Time (mean ± σ):      1.195 s ±  0.024 s    [User: 11.054 s, System: 0.294 s]
  Range (min … max):    1.160 s …  1.220 s    10 runs
 
Benchmark 2: node
  Time (mean ± σ):      2.678 s ±  0.034 s    [User: 13.570 s, System: 0.538 s]
  Range (min … max):    2.616 s …  2.732 s    10 runs
 
Summary
  bun ran
    2.24 ± 0.05 times faster than node
```
