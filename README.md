# Combinations App

This application generates combinations of items based on user input and stores them in a MySQL database. It is built using Node.js and Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) for managing multi-container Docker applications.

## Getting Started


### 1. Clone the Repository

```bash
git clone <repository-url>
cd combinations-task-app
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

### 3. Build and Run the Application

```bash
docker-compose up --build
```
### 4. Sending Requests

```bash
curl -X POST http://localhost:3000/generate \
-H "Content-Type: application/json" \
-d '{
  "items": [1, 2, 1],
  "length": 2
}'

```