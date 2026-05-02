.PHONY: build test clean deploy-testnet deploy-mainnet optimize help

# Build the contract
build:
	stellar contract build

# Run tests
test:
	cargo test

# Run tests with output
test-verbose:
	cargo test -- --nocapture

# Run specific test
test-one:
	cargo test $(TEST) -- --nocapture

# Clean build artifacts
clean:
	cargo clean
	rm -rf target/

# Optimize contract for deployment
optimize:
	stellar contract optimize --wasm target/wasm32-unknown-unknown/release/task_bounty.wasm

# Deploy to testnet
deploy-testnet:
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/task_bounty.wasm \
		--source deployer \
		--network testnet

# Deploy to mainnet (use with caution!)
deploy-mainnet:
	@echo "⚠️  WARNING: Deploying to MAINNET!"
	@echo "Make sure you have audited the contract and are using a secure key."
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		stellar contract deploy \
			--wasm target/wasm32-unknown-unknown/release/task_bounty.wasm \
			--source mainnet-deployer \
			--network mainnet; \
	fi

# Format code
fmt:
	cargo fmt

# Check formatting
fmt-check:
	cargo fmt -- --check

# Run clippy linter
lint:
	cargo clippy --target wasm32-unknown-unknown -- -D warnings

# Generate documentation
docs:
	cargo doc --no-deps --open

# Check contract size
size:
	@ls -lh target/wasm32-unknown-unknown/release/task_bounty.wasm

# Install dependencies
install:
	rustup target add wasm32-unknown-unknown
	cargo install --locked stellar-cli --features opt

# Generate TypeScript bindings
bindings:
	stellar contract bindings typescript \
		--contract-id $(CONTRACT_ID) \
		--network testnet \
		--output-dir ./bindings

# Watch and rebuild on changes (requires cargo-watch)
watch:
	cargo watch -x 'build --target wasm32-unknown-unknown --release'

# Run all checks before commit
check: fmt-check lint test
	@echo "✅ All checks passed!"

# Help
help:
	@echo "Available commands:"
	@echo "  make build           - Build the contract"
	@echo "  make test            - Run tests"
	@echo "  make test-verbose    - Run tests with output"
	@echo "  make test-one TEST=<name> - Run specific test"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make optimize        - Optimize contract for deployment"
	@echo "  make deploy-testnet  - Deploy to Stellar testnet"
	@echo "  make deploy-mainnet  - Deploy to Stellar mainnet"
	@echo "  make fmt             - Format code"
	@echo "  make fmt-check       - Check code formatting"
	@echo "  make lint            - Run clippy linter"
	@echo "  make docs            - Generate documentation"
	@echo "  make size            - Check contract size"
	@echo "  make install         - Install dependencies"
	@echo "  make bindings        - Generate TypeScript bindings"
	@echo "  make watch           - Watch and rebuild on changes"
	@echo "  make check           - Run all checks"
