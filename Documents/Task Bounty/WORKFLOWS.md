# TaskBounty Workflows

Visual guides for common TaskBounty workflows.

## Table of Contents
- [Happy Path: Task Completion](#happy-path-task-completion)
- [Rejection and Resubmission](#rejection-and-resubmission)
- [Dispute Resolution](#dispute-resolution)
- [Task Cancellation](#task-cancellation)
- [Multiple Contributors](#multiple-contributors)

---

## Happy Path: Task Completion

The ideal workflow where work is submitted and approved.

```
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 1. createTask{value: 1 ETH}
       │    - Title: "Build DEX Interface"
       │    - Deadline: 30 days
       │    - Max submissions: 3
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Open                   │
│  Reward: 1 ETH (escrowed)       │
└─────────────────────────────────┘
       │
       │ 2. submitWork
       │    - Work URL: github.com/user/dex
       │    - Description: "Completed interface"
       ▼
┌─────────────┐
│ Contributor │
└──────┬──────┘
       │
       │ 3. Poster reviews work
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 4. approveSubmission
       │
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Completed              │
│  Payment: 1 ETH → Contributor   │
└─────────────────────────────────┘
       │
       │ 5. Payment sent
       │
       ▼
┌─────────────┐
│ Contributor │
│ +1 ETH      │
└─────────────┘

✅ Task completed successfully!
```

### Code Example
```solidity
// 1. Poster creates task
uint256 taskId = bounty.createTask{value: 1 ether}(
    "Build DEX Interface",
    "Create a React frontend for Uniswap V3",
    block.timestamp + 30 days,
    3
);

// 2. Contributor submits work
uint256 submissionId = bounty.submitWork(
    taskId,
    "https://github.com/contributor/dex-ui",
    "Completed DEX interface with all features"
);

// 3. Poster approves
bounty.approveSubmission(taskId, submissionId);
// → 1 ETH automatically sent to contributor
```

---

## Rejection and Resubmission

When work doesn't meet requirements initially.

```
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 1. createTask{value: 1 ETH}
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Open                   │
└─────────────────────────────────┘
       │
       │ 2. submitWork (Contributor A)
       ▼
┌──────────────┐
│Contributor A │
└──────┬───────┘
       │
       │ 3. Poster reviews
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 4. rejectSubmission
       │    Reason: "Missing responsive design"
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Submission A: Rejected         │
│  Status: InProgress             │
└─────────────────────────────────┘
       │
       │ 5. submitWork (Contributor B)
       │    - Better implementation
       ▼
┌──────────────┐
│Contributor B │
└──────┬───────┘
       │
       │ 6. Poster reviews
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 7. approveSubmission
       │
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Completed              │
│  Payment: 1 ETH → Contributor B │
└─────────────────────────────────┘

✅ Contributor B wins the bounty!
```

### Code Example
```solidity
// Poster rejects first submission
bounty.rejectSubmission(taskId, submissionId1, "Missing responsive design");

// Another contributor submits better work
uint256 submissionId2 = bounty.submitWork(
    taskId,
    "https://github.com/contributor2/dex-ui",
    "Fully responsive DEX interface"
);

// Poster approves second submission
bounty.approveSubmission(taskId, submissionId2);
```

---

## Dispute Resolution

When contributor and poster disagree.

```
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 1. createTask{value: 1 ETH}
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
└─────────────────────────────────┘
       │
       │ 2. submitWork
       ▼
┌─────────────┐
│ Contributor │
└──────┬──────┘
       │
       │ 3. Poster reviews
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 4. rejectSubmission
       │    Reason: "Incomplete"
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Submission: Rejected           │
└─────────────────────────────────┘
       │
       │ 5. raiseDispute
       │    Reason: "Work meets all requirements"
       ▼
┌─────────────┐
│ Contributor │
└──────┬──────┘
       │
       │ 6. Dispute created
       │
       ▼
┌─────────────────────────────────┐
│     DisputeResolver Contract    │
│  Status: Open                   │
│  Task Status: Disputed          │
└─────────────────────────────────┘
       │
       │ 7. Review evidence
       │
       ▼
┌─────────────┐
│ Arbitrator  │
└──────┬──────┘
       │
       │ 8. resolveDispute(disputeId, true)
       │    Decision: Favor contributor
       ▼
┌─────────────────────────────────┐
│     DisputeResolver Contract    │
│  Status: Resolved               │
│  Outcome: Favor Contributor     │
└─────────────────────────────────┘

⚖️ Dispute resolved in favor of contributor
   (Poster can now approve based on arbitration)
```

### Code Example
```solidity
// Poster rejects
bounty.rejectSubmission(taskId, submissionId, "Incomplete work");

// Contributor disputes
bounty.raiseDispute(
    taskId,
    submissionId,
    "Work meets all stated requirements in the description"
);

// Arbitrator reviews and resolves
uint256 disputeId = resolver.getSubmissionDisputeId(taskId, submissionId);
resolver.resolveDispute(disputeId, true); // true = favor contributor

// Based on arbitration, poster should approve
// (In future versions, this could be automatic)
```

---

## Task Cancellation

When poster needs to cancel a task.

```
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 1. createTask{value: 1 ETH}
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Open                   │
│  Reward: 1 ETH (escrowed)       │
└─────────────────────────────────┘
       │
       │ Time passes...
       │ No suitable submissions
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 2. cancelTask
       │
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Cancelled              │
│  Refund: 1 ETH → Poster         │
└─────────────────────────────────┘
       │
       │ 3. Refund sent
       │
       ▼
┌─────────────┐
│   Poster    │
│ +1 ETH      │
└─────────────┘

✅ Task cancelled, poster refunded
```

### Code Example
```solidity
// Poster cancels task (only if no approved submissions)
bounty.cancelTask(taskId);
// → 1 ETH refunded to poster
```

### Cancellation Rules
- ✅ Can cancel if no submissions
- ✅ Can cancel if only rejected submissions
- ❌ Cannot cancel if any approved submission
- ❌ Cannot cancel if already completed

---

## Multiple Contributors

Competition between multiple contributors.

```
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       │ 1. createTask{value: 1 ETH}
       │    Max submissions: 3
       ▼
┌─────────────────────────────────┐
│     TaskBountyCore Contract     │
│  Status: Open                   │
│  Max submissions: 3             │
└─────────────────────────────────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Contrib A │  │Contrib B │  │Contrib C │  │Contrib D │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │ 2a.         │ 2b.         │ 2c.         │ 2d. ❌
     │ submit      │ submit      │ submit      │ Max reached!
     │             │             │             │
     ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────┐
│          TaskBountyCore Contract                    │
│  Submission A: Pending                              │
│  Submission B: Pending                              │
│  Submission C: Pending                              │
│  Status: InProgress                                 │
└─────────────────────────────────────────────────────┘
       │
       │ 3. Poster reviews all submissions
       │
       ▼
┌─────────────┐
│   Poster    │
└──────┬──────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
       │ 4a. reject  │ 4b. reject  │ 4c. approve │
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Contrib A │  │Contrib B │  │Contrib C │  │   Task   │
│ Rejected │  │ Rejected │  │ +1 ETH ✅│  │ Completed│
└──────────┘  └──────────┘  └──────────┘  └──────────┘

✅ Contributor C wins the competition!
```

### Code Example
```solidity
// Create task allowing 3 submissions
uint256 taskId = bounty.createTask{value: 1 ether}(
    "Build DEX Interface",
    "Description",
    block.timestamp + 30 days,
    3  // Max 3 submissions
);

// Three contributors submit
uint256 sub1 = bounty.submitWork(taskId, "url1", "desc1"); // Contributor A
uint256 sub2 = bounty.submitWork(taskId, "url2", "desc2"); // Contributor B
uint256 sub3 = bounty.submitWork(taskId, "url3", "desc3"); // Contributor C

// Fourth contributor tries to submit - FAILS
// bounty.submitWork(taskId, "url4", "desc4"); // ❌ MaxSubmissionsReached

// Poster reviews and picks winner
bounty.rejectSubmission(taskId, sub1, "Not responsive");
bounty.rejectSubmission(taskId, sub2, "Missing features");
bounty.approveSubmission(taskId, sub3); // Winner!
```

---

## State Transition Diagram

### Task States
```
        ┌─────────────┐
        │    Open     │ ← Initial state
        └──────┬──────┘
               │
               │ submitWork()
               ▼
        ┌─────────────┐
        │ InProgress  │
        └──────┬──────┘
               │
       ┌───────┼───────┬─────────┐
       │       │       │         │
       │       │       │         │ raiseDispute()
       │       │       │         ▼
       │       │       │   ┌──────────┐
       │       │       │   │ Disputed │
       │       │       │   └──────────┘
       │       │       │
       │       │       │ approveSubmission()
       │       │       ▼
       │       │  ┌──────────┐
       │       │  │Completed │ ← Final state
       │       │  └──────────┘
       │       │
       │       │ cancelTask()
       │       ▼
       │  ┌──────────┐
       │  │Cancelled │ ← Final state
       │  └──────────┘
       │
       │ cancelTask() (no submissions)
       ▼
  ┌──────────┐
  │Cancelled │ ← Final state
  └──────────┘
```

### Submission States
```
  ┌─────────┐
  │ Pending │ ← Initial state
  └────┬────┘
       │
   ┌───┴───┐
   │       │
   │       │ approveSubmission()
   │       ▼
   │  ┌─────────┐
   │  │Approved │ ← Final state
   │  └─────────┘
   │
   │ rejectSubmission()
   ▼
┌─────────┐
│Rejected │ ← Final state
└─────────┘
```

---

## Timeline Example

Real-world timeline for a 30-day task:

```
Day 0: Task Created
│
│  ┌─────────────────────────────────────┐
│  │ Task: "Build DEX Interface"         │
│  │ Reward: 1 ETH                       │
│  │ Deadline: Day 30                    │
│  │ Max Submissions: 3                  │
│  └─────────────────────────────────────┘
│
Day 5: First Submission
│  └─ Contributor A submits work
│
Day 10: Second Submission
│  └─ Contributor B submits work
│
Day 15: Third Submission
│  └─ Contributor C submits work
│  └─ Max submissions reached!
│
Day 18: Review Period
│  ├─ Poster reviews all submissions
│  ├─ Rejects Submission A (incomplete)
│  ├─ Rejects Submission B (bugs)
│  └─ Approves Submission C ✅
│
Day 18: Payment
│  └─ 1 ETH sent to Contributor C
│  └─ Task marked as Completed
│
Day 30: Deadline (task already completed)
│
✅ Task lifecycle complete!
```

---

## Error Scenarios

### Scenario 1: Expired Task
```
Day 0: Task created (deadline: Day 30)
Day 31: Contributor tries to submit
Result: ❌ TaskExpired error
```

### Scenario 2: Double Submission
```
Day 5: Contributor A submits work
Day 6: Contributor A tries to submit again
Result: ❌ AlreadySubmitted error
```

### Scenario 3: Unauthorized Approval
```
Day 5: Contributor A submits work
Day 6: Contributor B tries to approve it
Result: ❌ Unauthorized error (only poster can approve)
```

### Scenario 4: Insufficient Reward
```
Poster tries to create task with 0.0001 ETH
Result: ❌ InsufficientReward error (minimum is 0.001 ETH)
```

---

## Best Practices

### For Posters
1. ✅ Write clear, detailed task descriptions
2. ✅ Set reasonable deadlines
3. ✅ Review submissions promptly
4. ✅ Provide feedback when rejecting
5. ✅ Use disputes only when necessary

### For Contributors
1. ✅ Read task requirements carefully
2. ✅ Submit high-quality work
3. ✅ Include detailed descriptions
4. ✅ Respond to feedback
5. ✅ Use disputes responsibly

### For Arbitrators
1. ✅ Review all evidence objectively
2. ✅ Consider both perspectives
3. ✅ Make fair, consistent decisions
4. ✅ Document reasoning
5. ✅ Resolve disputes promptly

---

## Integration Examples

### With Frontend
```javascript
// Create task
const tx = await bounty.createTask(
  "Build DEX Interface",
  "Description",
  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  3,
  { value: ethers.utils.parseEther("1.0") }
);

// Listen for events
bounty.on("TaskCreated", (taskId, poster, title, reward, deadline) => {
  console.log(`Task ${taskId} created: ${title}`);
});

bounty.on("WorkSubmitted", (taskId, submissionId, contributor, workUrl) => {
  console.log(`New submission ${submissionId} for task ${taskId}`);
});
```

### With Subgraph
```graphql
query GetTask($taskId: ID!) {
  task(id: $taskId) {
    id
    poster
    title
    description
    reward
    deadline
    status
    submissions {
      id
      contributor
      workUrl
      status
    }
  }
}
```

---

For more details, see:
- [README.md](README.md) - Project overview
- [API.md](API.md) - Complete API reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
