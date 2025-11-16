Unified Event Analytics Engine

A scalable event-driven analytics backend with API key authentication, Redis caching, rate limiting, aggregation endpoints, Google OAuth onboarding, and full automated test coverage. Built for real-world performance, reliability, and cloud deployment.

🔗 Live Deployment

Backend API (Render):
👉 https://unified-event-analytics-engine-uqin.onrender.com

Swagger Docs:
👉 https://unified-event-analytics-engine-uqin.onrender.com/api-docs

📌 Tech Stack

Node.js (Express)

MongoDB + Mongoose

Redis (rate limiting + caching)

Docker + Docker Compose

Jest + Supertest (100% passing tests)

Swagger / OpenAPI 3.0

ES Modules

Passport + Google OAuth 2.0

⭐ Features
🔑 API Key Management

✔ Register apps to receive API keys
✔ Rotate / revoke / regenerate API keys
✔ Block revoked / expired keys
✔ HMAC hashing (no plaintext storage)

📊 Event Collection

✔ High-volume ingestion
✔ Device, browser, metadata, user ID
✔ Auto timestamps
✔ Bulk inserts

📈 Analytics & Reporting

✔ /event-summary – Event-level aggregation
✔ /user-stats – User-level analytics
✔ Date & app-based filtering
✔ Indexed aggregation pipelines

⚡ Performance

🚀 Redis cache
🚀 Redis-based rate limiting
🚀 MongoDB indexes
🚀 Bulk write ingestion

🧪 Testing

✔ Fully isolated test environment
✔ MongoDB + Redis mocked
✔ Jest + Supertest end-to-end tests
✔ 100% passing

Test Suites: 8 passed, 8 total
Tests:       14 passed, 14 total

🚀 Running Locally (Recommended via Docker)
Requirements

Docker Desktop / Docker Engine

Start the full stack
docker compose up --build

View running containers
docker compose ps


Expected:

analytics-backend   Up 0.0.0.0:8000->8000/tcp
analytics-redis     Up 0.0.0.0:6379->6379/tcp

Access

API → http://localhost:8000

Swagger → http://localhost:8000/api-docs

🔧 Manual Local Setup (No Docker)
npm install
npm run dev

Requirements

MongoDB running locally

Redis running locally

⚙️ Environment Variables

.env example:

PORT=8000
MONGODB_URI=mongodb://localhost:27017/analytics
REDIS_URL=redis://localhost:6379
API_KEY_SECRET=somesecret
CORS_ORIGIN=*
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

🔐 Google OAuth Onboarding

Users must log in via Google to manage apps & API keys

/api/auth/register is protected by OAuth

Test mode automatically bypasses Google login for automated tests

🔐 API Endpoints Summary
AUTH (API Keys)
Method	Endpoint	Description
POST	/api/auth/register	Create app + API key
POST	/api/auth/regenerate	Rotate key
POST	/api/auth/revoke	Revoke key
ANALYTICS
Method	Endpoint	Description
POST	/api/analytics/collect	Submit events
GET	/api/analytics/event-summary	Aggregate by event
GET	/api/analytics/user-stats	User-level analytics
📌 Example Event Payload
{
  "event": "login_form_cta_click",
  "url": "https://example.com",
  "referrer": "https://google.com",
  "device": "mobile",
  "ipAddress": "192.168.0.1",
  "timestamp": "2024-11-16T08:15:30.000Z",
  "metadata": {
    "browser": "Chrome",
    "os": "Android",
    "screenSize": "1080x1920"
  },
  "userId": "user123"
}

📊 Sample Aggregation Response

GET /api/analytics/event-summary

{
  "success": true,
  "data": {
    "event": "page_view",
    "count": 3400,
    "uniqueUsers": 1200,
    "deviceData": {
      "mobile": 2200,
      "desktop": 1200
    }
  }
}

🧠 Architecture & Design Decisions
Requirement	Decision
Efficient analytics	Mongo aggregation pipelines
High scale ingestion	Bulk writes
Secure API keys	HMAC SHA-256 hashing
Rate limiting	Redis + express-rate-limit
Caching	Redis
OAuth onboarding	Google OAuth 2.0
Performance	Indexed queries + caching
Maintainability	Modular folder structure
Tests	Mocks + full E2E coverage
CI/CD	Docker-based runtime

🧩 Challenges & Solutions
Challenge	Solution
Running Redis & Mongo locally	Docker Compose
Secure API key storage	HMAC SHA-256 hashing
Rate limiting breaking tests	Test-mode bypass using NODE_ENV
High-frequency event writes	Bulk write insert with batching
OAuth required but tests must run	Auth auto-bypass in test mode
Redis missing in CI	Redis mock
Event summarization performance	Compound indexed aggregations

📂 Project Structure
src/
  controllers/
  routes/
  models/
  middlewares/
  utils/
  validations/
  config/
  swagger/
tests/
  analytics/
  auth/
  security/
docker-compose.yml
Dockerfile
README.md

📌 Requirement Mapping (Official Task Coverage)
Task Requirement	Implemented
API Key creation	✔ /api/auth/register
Revocation	✔ /api/auth/revoke
Regeneration	✔ /api/auth/regenerate
Event collection	✔ /api/analytics/collect
Analytics endpoints	✔ summary + user stats
Caching (Redis)	✔
Rate limiting	✔
Dockerized	✔
Swagger docs	✔
Test suite	✔ (100% passing)
Deployment	✔ Render
Google Auth onboarding	✔
Performance focus	✔
Clean code	✔
Git history	✔

🧪 Running Tests
npm test

Expected output:

Test Suites: 8 passed, 8 total
Tests:       14 passed, 14 total
