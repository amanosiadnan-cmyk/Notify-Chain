# Contributing to TaskBounty

Thank you for your interest in contributing to TaskBounty! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Basic understanding of Solidity and smart contracts
- Familiarity with Git and GitHub

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/TaskBounty.git
   cd TaskBounty
   ```

3. Install dependencies:
   ```bash
   forge install
   ```

4. Run tests to ensure everything works:
   ```bash
   forge test
   ```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Write Tests

All new features and bug fixes must include tests:

```solidity
function testYourFeature() public {
    // Setup
    // Execute
    // Assert
}
```

### 4. Run Tests

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testYourFeature

# Check gas usage
forge test --gas-report
```

### 5. Check Coverage

```bash
forge coverage
```

Aim for >90% code coverage.

### 6. Format Code

```bash
forge fmt
```

### 7. Commit Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add milestone-based task support"
git commit -m "fix: prevent reentrancy in approveSubmission"
git commit -m "docs: update README with new examples"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `test:` test additions or changes
- `refactor:` code refactoring
- `chore:` maintenance tasks

### 8. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use the same format as commit messages:
- `feat: add reputation system`
- `fix: resolve dispute resolution bug`

### PR Description

Include:
1. **What**: What changes does this PR introduce?
2. **Why**: Why are these changes needed?
3. **How**: How were the changes implemented?
4. **Testing**: What tests were added/modified?
5. **Breaking Changes**: Any breaking changes?

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Gas optimization considered
- [ ] Security implications reviewed
- [ ] No compiler warnings
- [ ] Branch is up to date with main

## Code Style Guidelines

### Solidity Style

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title ContractName
 * @notice Brief description
 * @dev Detailed technical notes
 */
contract ContractName {
    /// @notice State variable description
    uint256 public stateVariable;

    /// @notice Error description
    error CustomError();

    /// @notice Event description
    event SomethingHappened(address indexed user, uint256 amount);

    /**
     * @notice Function description
     * @param param1 Parameter description
     * @return returnValue Return value description
     */
    function someFunction(uint256 param1) external returns (uint256 returnValue) {
        // Implementation
    }
}
```

### Naming Conventions

- **Contracts**: PascalCase (`TaskBountyCore`)
- **Functions**: camelCase (`createTask`)
- **Variables**: camelCase (`taskId`)
- **Constants**: UPPER_SNAKE_CASE (`MIN_REWARD`)
- **Private/Internal**: prefix with underscore (`_taskIdCounter`)
- **Events**: PascalCase (`TaskCreated`)
- **Errors**: PascalCase (`TaskNotFound`)

### Documentation

- Use NatSpec comments for all public/external functions
- Document complex logic with inline comments
- Keep comments up to date with code changes
- Explain *why*, not just *what*

## Testing Guidelines

### Test Structure

```solidity
contract FeatureTest is Test {
    // State variables
    ContractName public contract;
    address public user = address(0x1);

    // Setup
    function setUp() public {
        contract = new ContractName();
        vm.deal(user, 10 ether);
    }

    // Happy path tests
    function testFeatureWorks() public {
        // Test normal operation
    }

    // Edge cases
    function testFeatureEdgeCase() public {
        // Test boundary conditions
    }

    // Error cases
    function testFeatureReverts() public {
        vm.expectRevert(CustomError.selector);
        // Test error conditions
    }

    // Fuzz tests
    function testFuzz_Feature(uint256 amount) public {
        // Test with random inputs
    }
}
```

### Test Coverage

Ensure tests cover:
- ✅ Happy paths
- ✅ Edge cases
- ✅ Error conditions
- ✅ Access control
- ✅ State transitions
- ✅ Event emissions
- ✅ Gas optimization

## Security Guidelines

### Best Practices

1. **Checks-Effects-Interactions Pattern**
   ```solidity
   function withdraw() external {
       // Checks
       require(balance[msg.sender] > 0);
       
       // Effects
       uint256 amount = balance[msg.sender];
       balance[msg.sender] = 0;
       
       // Interactions
       (bool success, ) = msg.sender.call{value: amount}("");
       require(success);
   }
   ```

2. **Reentrancy Protection**
   ```solidity
   modifier nonReentrant() {
       require(_locked == 1);
       _locked = 2;
       _;
       _locked = 1;
   }
   ```

3. **Input Validation**
   ```solidity
   function setDeadline(uint256 deadline) external {
       require(deadline > block.timestamp, "Invalid deadline");
       require(deadline < block.timestamp + MAX_DURATION, "Too far");
   }
   ```

4. **Access Control**
   ```solidity
   modifier onlyOwner() {
       require(msg.sender == owner, "Unauthorized");
       _;
   }
   ```

### Security Checklist

- [ ] No reentrancy vulnerabilities
- [ ] Proper access control
- [ ] Input validation on all parameters
- [ ] No integer overflow/underflow
- [ ] Safe external calls
- [ ] No front-running vulnerabilities
- [ ] Proper event emission
- [ ] Gas limit considerations

## Gas Optimization

### Tips

1. **Use `immutable` for constants set at deployment**
   ```solidity
   address public immutable owner;
   ```

2. **Pack storage variables**
   ```solidity
   struct Packed {
       uint128 a;  // 16 bytes
       uint128 b;  // 16 bytes - same slot
   }
   ```

3. **Use events for data that doesn't need to be on-chain**
   ```solidity
   event DataStored(string data);  // Instead of storing in contract
   ```

4. **Cache storage variables**
   ```solidity
   uint256 cached = storageVar;  // Read once
   // Use cached multiple times
   ```

5. **Use `calldata` for read-only function parameters**
   ```solidity
   function process(string calldata data) external {
       // More gas efficient than memory
   }
   ```

## Documentation

### What to Document

- **README.md**: Overview, quick start, usage examples
- **ARCHITECTURE.md**: System design, contracts, data structures
- **API Documentation**: All public functions with NatSpec
- **Deployment Guide**: How to deploy and configure
- **User Guide**: How to use the system

### Documentation Style

- Clear and concise
- Include code examples
- Use diagrams where helpful
- Keep up to date with code

## Review Process

### For Contributors

1. Ensure all tests pass
2. Address reviewer feedback promptly
3. Keep PR scope focused
4. Be open to suggestions

### For Reviewers

1. Review code thoroughly
2. Test locally if needed
3. Provide constructive feedback
4. Approve when ready

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions
- Check existing issues and PRs first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to TaskBounty! 🎉
