# 🚀 Socinize Milestones & Build Roadmap

Socinize is a serverless social media scheduler allowing users to draft, schedule, and post to social media platforms from one unified dashboard. This roadmap outlines major milestones to build the MVP and future features using AWS SAM and EventBridge Scheduler.

---

## ✅ Phase 0: Setup & Initialization

- [ ] Initialize monorepo structure:
  - `/frontend` (React/Next.js)
  - `/backend` (AWS SAM)
- [ ] Run `sam init` for project scaffold
- [ ] Define `sam-template.yaml` with:
  - API Gateway
  - Core Lambdas
  - DynamoDB tables
  - IAM roles
- [ ] Create and configure:
  - DynamoDB: `Users`, `Posts`, `SocialAccounts`
  - S3 bucket for media uploads
  - Cognito user pool
- [ ] Set up Twitter Developer App

---

## 🔐 Phase 1: Authentication & User Management

- [ ] Integrate Amazon Cognito
  - Sign up, sign in, JWT token issuing
- [ ] Add Cognito user pool authorizer to API Gateway
- [ ] Store user info (`user_id`, `email`) in `Users` table
- [ ] Protect backend endpoints using JWT

---

## ✍️ Phase 2: Post Drafting & Media Upload

- [ ] Build post composer UI (text + media)
- [ ] Upload media to S3 using pre-signed URLs
- [ ] Store post drafts in `Posts` table with status = `draft`
- [ ] Enable preview, edit, and delete draft functionality

---

## 🔗 Phase 3: Twitter OAuth Integration

- [ ] Create `SocialConnect` Lambda
  - Handle Twitter OAuth 2.0
  - Store tokens securely in `SocialAccounts` table or Secrets Manager
- [ ] Frontend flow:
  - User clicks "Connect Twitter"
  - Redirect → Twitter → Callback → Save tokens
- [ ] Validate token on connect

---

## 📆 Phase 4: Post Scheduling via EventBridge Scheduler

- [ ] User chooses to "Post Now" or "Schedule Later"
- [ ] On schedule:
  - Save post with status `scheduled`
  - Call `CreateSchedule` with `at(scheduled_time)`
  - Pass `postId` to `PostPublisher` Lambda
- [ ] Store Scheduler job name in `Posts.schedule_id`

---

## 🤖 Phase 5: Post Execution Logic

- [ ] `PostPublisher` Lambda:
  - Triggered by EventBridge Scheduler
  - Fetch post from DynamoDB
  - Post to Twitter using stored token
  - Update post `status` to `posted` or `failed`
- [ ] Add DLQ for failures
- [ ] Enable retry strategy or alerting

---

## 🖼️ Phase 6: Dashboard for Posts

- [ ] Frontend UI:
  - Upcoming scheduled posts
  - History of posted/failed posts
- [ ] API to fetch posts by user
- [ ] Add filters by platform, status, time

---

## 🛡️ Phase 7: Security & Permissions

- [ ] Secure API endpoints with Cognito JWT auth
- [ ] IAM roles:
  - Lambda → DynamoDB, S3, Secrets Manager
  - Scheduler → Lambda (InvokeFunction)
- [ ] Encrypt tokens at rest (via Secrets Manager or KMS)
- [ ] Validate all inputs in backend APIs

---

## 🔮 Phase 8: Multi-Platform Support

- [ ] Abstract social posting logic
  - `PostPublisher` uses platform-specific adapters
- [ ] Add LinkedIn integration (OAuth + API)
- [ ] Generalize token storage and refresh

---

## 📦 Bonus Features

- [ ] CSV upload for bulk post scheduling
- [ ] Save post templates for reuse
- [ ] Team mode (org with multiple users)
- [ ] Notification system (success/failure alerts)
