# Overview

This is an educational blockchain application demonstrating core blockchain principles through a web-based interface. The project implements transaction management, block mining with proof-of-work, and blockchain validation. Built as a full-stack application, it uses Laravel 12 for the backend API, React with Vite for the frontend interface, and PostgreSQL for persistent data storage.

The application allows users to create transactions, mine blocks containing pending transactions using a simplified proof-of-work algorithm (requiring hashes to start with "0" - difficulty 1), and validate the entire blockchain's integrity. This serves as a learning tool for understanding blockchain concepts like immutability, cryptographic hashing (SHA256), and chain validation. Mining typically takes 5-10 seconds per block.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture (Laravel 12)

**Framework Choice**: Laravel 12 with PHP 8.4 provides modern PHP features, built-in API development tools, and robust database abstraction through Eloquent ORM.

**API-First Design**: The backend serves as a RESTful API consumed by the React frontend. Endpoints follow RESTful conventions for creating transactions, mining blocks, and retrieving blockchain data.

**Database Design**: PostgreSQL stores the blockchain data in a relational structure with three main tables:
- **Transactions**: Stores individual transactions with sender, receiver, amount, timestamp, and status (pending/mined)
- **Blocks**: Stores blockchain blocks with index, previous hash, current hash, nonce (for proof-of-work), and timestamp
- **Block_Transactions (Pivot)**: Many-to-many relationship linking blocks to their contained transactions

This relational approach allows efficient querying while maintaining blockchain integrity through hash linkage.

**Proof-of-Work Implementation**: SHA256 hashing generates block hashes. The mining process iterates nonces until finding a hash starting with "00", simulating Bitcoin's difficulty mechanism in a simplified form.

**Validation Logic**: Chain validation verifies:
1. Each block's hash correctly represents its contents
2. Previous hash links are unbroken
3. Proof-of-work requirement is satisfied for each block

## Frontend Architecture (React + Vite)

**Build Tool**: Vite provides fast development server with hot module replacement and optimized production builds.

**Component Structure**: React components display the blockchain state including:
- Transaction creation form
- Pending transactions list
- Block chain visualization
- Validation status indicator

**Styling**: TailwindCSS provides utility-first styling with PostCSS processing for optimal CSS generation.

**API Communication**: Axios handles HTTP requests to the Laravel backend with promise-based async operations.

**Routing**: React Router DOM enables client-side navigation between different views (transaction management, blockchain view, etc.).

## Data Flow Architecture

1. **Transaction Creation**: User submits transaction → Frontend sends POST to `/api/transaction` → Laravel validates and stores with "pending" status
2. **Block Mining**: User triggers mining → Frontend calls `/api/block/mine` → Backend groups pending transactions → Proof-of-work algorithm finds valid hash → Block saved, transactions marked "mined"
3. **Validation**: Frontend requests `/api/blockchain/validate` → Backend walks chain verifying hash links and proof-of-work → Returns validation result

## Security Considerations

**Hash Integrity**: SHA256 ensures tamper detection - any modification invalidates the hash chain.

**No Authentication**: This educational application doesn't implement user authentication, focusing purely on blockchain mechanics.

# External Dependencies

## Backend Dependencies

**Laravel Framework (^12.0)**: Core framework providing routing, database ORM (Eloquent), validation, and API scaffolding.

**PostgreSQL Database**: Relational database for persistent storage. Connection configured via Laravel's database configuration with support for Neon (cloud PostgreSQL provider).

**Guzzle HTTP Client (^7.8)**: HTTP client library for making external requests if needed for future features.

**Laravel Sanctum (^4.0)**: API token authentication package (included but potentially unused in educational version).

**Composer**: PHP dependency management.

## Frontend Dependencies

**React (^19.1.1)**: UI library for building component-based interfaces.

**React Router DOM (^7.9.4)**: Client-side routing for single-page application navigation.

**Axios (^1.12.2)**: Promise-based HTTP client for API requests to Laravel backend.

**Vite (^7.1.7)**: Frontend build tool and development server.

**TailwindCSS (^4.1.14)**: Utility-first CSS framework with PostCSS plugin integration.

**@tailwindcss/postcss (^4.1.14)**: PostCSS plugin for processing Tailwind styles.

## Development Tools

**PHP_CodeSniffer & Laravel Pint**: Code formatting and style checking for PHP/Laravel code.

**Faker**: Test data generation for seeding blockchain with sample transactions during development.

**Concurrently (backend)**: Runs multiple npm/composer scripts simultaneously for development workflow.

**ESLint**: JavaScript/React code linting with React-specific rules.

## Infrastructure

**No Docker Configuration Present**: While the project specification mentions optional Docker support, the repository doesn't include Docker configuration files. The application expects local PHP 8.4, Composer, Node.js/npm, and PostgreSQL installations.

**Neon PostgreSQL**: Project README mentions PostgreSQL (Neon), suggesting cloud-hosted PostgreSQL as the intended database provider rather than local PostgreSQL setup.