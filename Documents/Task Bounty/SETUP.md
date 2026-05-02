# TaskBounty Setup Guide (Stellar/Soroban)

This guide will help you set up the TaskBounty development environment for Stellar.

## Prerequisites

### 1. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verify installation:
```bash
rustc --version
cargo --version
```

### 2. Add WebAssembly Target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install Stellar CLI

```bash
cargo install --locked stellar-cli --features opt
```

Verify installation:
```bash
stellar --version
```

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-bounty
```

### 2. Build Contracts

```bash
stellar contract build
```

Expected output:
```
Compiling task-bounty v0.1.0
Finished release [optimized] target(s) in 15.2s
```

### 3. Run Tests

```bash
cargo test
```

Expected output:
```
running 15 tests
test test::test_create_task ... ok
test test::test_submit_work ... ok
test test::test_approve_submission ... ok
...
test result: ok. 15 passed; 0 failed; finished in 2.5s
```

### 4. Optimize Contract (for deployment)

```bash
stellar contract optimize \
  --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm
```

## Configuration

### 1. Get Test XLM

For Testnet development:

```bash
# Generate a test identity
stellar keys generate test-user --network testnet

# Fund with Friendbot
stellar keys fund test-user --network testnet
```

### 2. Configure Network

Create `.stellar/config.toml`:

```toml
[network.testnet]
rpc_url = "https://soroban-testnet.stellar.org"
network_passphrase = "Test SDF Network ; September 2015"

[network.mainnet]
rpc_url = "https://soroban-rpc.stellar.org"
network_passphrase = "Public Global Stellar Network ; September 2015"
```

## Development Workflow

### 1. Build Contract

```bash
# Development build
cargo build --target wasm32-unknown-unknown --release

# Or use Stellar CLI
stellar contract build
```

### 2. Run Tests

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_create_task

# Run with coverage (requires cargo-tarpaulin)
cargo tarpaulin --out Html
```

### 3. Deploy to Testnet

```bash
# Deploy contract
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm \
  --source test-user \
  --network testnet

# Save the contract ID
export CONTRACT_ID=<returned-contract-id>
```

### 4. Initialize Contract

```bash
# Initialize with dispute resolver and admin
stellar contract invoke \
  --id $CONTRACT_ID \
  --source test-user \
  --network testnet \
  -- \
  initialize \
  --dispute_resolver <DISPUTE_RESOLVER_ADDRESS> \
  --admin <ADMIN_ADDRESS>
```

### 5. Interact with Contract

```bash
# Create a task
stellar contract invoke \
  --id $CONTRACT_ID \
  --source test-user \
  --network testnet \
  -- \
  create_task \
  --poster <POSTER_ADDRESS> \
  --title "Build DEX Interface" \
  --description "Create a React frontend" \
  --token <TOKEN_ADDRESS> \
  --reward 1000000000 \
  --deadline 1735689600 \
  --max_submissions 3

# Get task details
stellar contract invoke \
  --id $CONTRACT_ID \
  --source test-user \
  --network testnet \
  -- \
  get_task \
  --task_id 1
```

## Deployment

### Testnet Deployment

```bash
# 1. Build optimized contract
stellar contract build
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm

# 2. Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm \
  --source deployer \
  --network testnet

# 3. Initialize
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --dispute_resolver $DISPUTE_RESOLVER \
  --admin $ADMIN
```

### Mainnet Deployment

```bash
# ⚠️ AUDIT FIRST!
# Use a hardware wallet or secure key management

# 1. Build and optimize
stellar contract build
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm

# 2. Deploy to mainnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm \
  --source mainnet-deployer \
  --network mainnet

# 3. Initialize
stellar contract invoke \
  --id $CONTRACT_ID \
  --source mainnet-deployer \
  --network mainnet \
  -- \
  initialize \
  --dispute_resolver $DISPUTE_RESOLVER \
  --admin $ADMIN
```

## Troubleshooting

### "stellar: command not found"

Stellar CLI is not installed or not in PATH.

**Solution:**
```bash
cargo install --locked stellar-cli --features opt
```

### "error: linker `rust-lld` not found"

WebAssembly target not installed.

**Solution:**
```bash
rustup target add wasm32-unknown-unknown
```

### "failed to compile"

Dependencies not up to date.

**Solution:**
```bash
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

### "insufficient balance"

Not enough XLM for transaction fees.

**Solution:**
```bash
# Get test XLM from Friendbot
stellar keys fund test-user --network testnet
```

### Tests Failing

**Solution:**
```bash
# Clean and rebuild
cargo clean
cargo test
```

## IDE Setup

### VS Code

Install extensions:
1. [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
2. [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
3. [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml)

Add to `.vscode/settings.json`:
```json
{
  "rust-analyzer.cargo.target": "wasm32-unknown-unknown",
  "rust-analyzer.checkOnSave.allTargets": false
}
```

### Vim/Neovim

Install [rust.vim](https://github.com/rust-lang/rust.vim) and configure LSP.

## Useful Commands

```bash
# Build
cargo build --target wasm32-unknown-unknown --release
stellar contract build

# Test
cargo test
cargo test -- --nocapture
cargo test test_name

# Optimize
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm

# Deploy
stellar contract deploy --wasm <WASM_FILE> --source <KEY> --network testnet

# Invoke
stellar contract invoke --id <CONTRACT_ID> --source <KEY> --network testnet -- <FUNCTION> <ARGS>

# Generate bindings
stellar contract bindings typescript --contract-id <CONTRACT_ID> --network testnet --output-dir ./bindings

# Check contract
stellar contract inspect --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm
```

## Next Steps

1. ✅ Read [README.md](README.md) for project overview
2. ✅ Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. ✅ Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
4. ✅ Explore the contract code in `src/`
5. ✅ Run the tests
6. ✅ Deploy to testnet
7. ✅ Build something awesome!

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Stellar CLI Docs](https://developers.stellar.org/docs/tools/developer-tools)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

## Support

- [Stellar Discord](https://discord.gg/stellardev)
- [Stellar Stack Exchange](https://stellar.stackexchange.com/)
- GitHub Issues

Happy building on Stellar! 🚀
