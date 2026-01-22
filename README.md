
[![Watch the demo video](https://img.shields.io/badge/Watch-Demo-blue)](https://drive.google.com/file/d/1HlkOkh9LQ0muj-l5PFcwlB8N2dzcvMxw/view?usp=sharing)

# Simple Blockchain Application

An educational blockchain application built with Laravel 12, React, and PostgreSQL that demonstrates core blockchain principles including transaction management, block mining with proof of work, and chain validation.

## Features

- **Transaction Management**: Create and track transactions with sender, receiver, and amount
- **Block Mining**: Proof of work algorithm requiring hash to start with "00"
- **Blockchain Validation**: Verify chain integrity by checking hash links and proof of work
- **PostgreSQL Storage**: Persistent storage of blocks and transactions
- **Interactive Dashboard**: Real-time visualization of blockchain state

## Technology Stack

### Backend
- Laravel 12
- PostgreSQL (Neon)
- PHP 8.4
- SHA256 hashing for blockchain security

### Frontend
- React with Vite
- TailwindCSS
- Axios for API communication

## Architecture

### Database Schema

**Transactions Table**
- id, sender, receiver, amount, timestamp, status (pending/mined)

**Blocks Table**
- id, index_no, previous_hash, current_hash, nonce, timestamp

**Block Transactions Table** (Pivot)
- id, block_id, transaction_id

### API Endpoints

- `POST /api/transaction` - Create a new transaction
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/pending` - List pending transactions
- `POST /api/block/mine` - Mine a new block with pending transactions
- `GET /api/blocks` - List all blocks in the chain
- `GET /api/blockchain/validate` - Validate blockchain integrity

### Blockchain Security

1. **SHA256 Hashing**: Each block's hash is generated using SHA256 of:
   - Block index
   - Timestamp
   - Transaction data
   - Previous block hash
   - Nonce

2. **Proof of Work**: Mining requires finding a nonce that produces a hash starting with "00" (difficulty = 2)

3. **Immutability**: Once mined, blocks cannot be edited or deleted. Transactions transition from "pending" to "mined" status.

4. **Chain Validation**: The system verifies:
   - Each block's hash matches its recalculated hash
   - Each block's previous_hash matches the previous block's current_hash
   - All hashes satisfy the proof of work difficulty

## How to Use

1. **Create Transactions**: 
   - Go to the "Transactions" tab
   - Fill in sender, receiver, and amount
   - Submit the transaction (it will be in "pending" status)

2. **Mine a Block**:
   - When you have pending transactions, click "Mine Block"
   - The system will use proof of work to find a valid nonce
   - All pending transactions are added to the new block

3. **View Blockchain**:
   - Go to the "Blocks" tab to see all mined blocks
   - Each block shows its hash, previous hash, nonce, and contained transactions

4. **Validate Chain**:
   - Click "Validate Chain" on the Dashboard
   - The system checks the entire blockchain for integrity
   - Returns "Valid" if no tampering detected, "Invalid" otherwise

## Blockchain Principles Demonstrated

- **Decentralization**: Each block references the previous block creating an unbreakable chain
- **Transparency**: All transactions and blocks are visible and traceable
- **Immutability**: Changing any historical data breaks the chain validation
- **Proof of Work**: Computational work required to add new blocks (mining)
- **Data Integrity**: Cryptographic hashing ensures data cannot be tampered with

## Security Implementation

- All validation rules enforce: amount > 0, sender ≠ receiver, all fields required
- Blocks are immutable once mined
- Hash validation ensures data integrity
- Database constraints prevent inconsistent data
- No direct editing of blockchain tables allowed

## Project Structure

```
/backend
  /app
    /Models - Block, Transaction models
    /Services - BlockchainService with hashing and validation logic
    /Http/Controllers/Api - API controllers
  /database/migrations - Database schema

/frontend
  /src
    App.jsx - Main React application with Dashboard, Transactions, and Blocks views
```

## Blockchain Workflow

1. User creates multiple transactions → stored as "pending"
2. User clicks "Mine Block" → system groups pending transactions
3. System computes hash with increasing nonce until valid (proof of work)
4. Block is added to blockchain and saved to database
5. All transactions in block become "mined"
6. Chain can be validated to verify integrity

## Educational Value

This project demonstrates:
- How blockchain achieves immutability through cryptographic hashing
- Why proof of work makes tampering computationally expensive
- How blocks link together to form an unbreakable chain
- The role of mining in blockchain consensus
- How data integrity is verified through hash validation
