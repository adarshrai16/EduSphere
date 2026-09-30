# EduSphere

EduSphere is a course marketplace and learning platform. Educators publish courses and manage learner activity; students browse courses, purchase access, track lesson progress, and rate courses.

## Project At A Glance

- **Client:** React 19, Vite, React Router, Clerk React, Axios, Quill, and CSS/Tailwind utilities.
- **Server:** Node.js, Express 5, Mongoose, Clerk Express, Stripe, Cloudinary, Multer, and Svix.
- **Database:** MongoDB stores user profiles, courses, purchases, enrollments, ratings, and course progress.
- **Identity:** Clerk handles sign-in and educator roles. Clerk webhooks synchronize user profiles into MongoDB.
- **Payments:** Stripe Checkout collects payment. Signed Stripe webhooks record payment outcomes and grant course enrollment.
- **Course images:** Uploaded to Cloudinary; only the image URL is stored with the MongoDB course document.

## Main Features

### Students

- Browse and search published courses.
- View course descriptions, educator details, curriculum, price, and ratings.
- Sign in with Clerk and purchase courses through Stripe Checkout.
- Access purchased courses, mark lessons complete, and rate courses.

### Educators

- Apply for educator access through Clerk public metadata.
- Create courses with a thumbnail, chapters, and lessons.
- View course, enrollment, and earnings summaries.
- View enrolled learners and delete courses they own.

## Architecture And Data Flow

1. **Authentication and profiles:** The client uses Clerk for authentication. The server reads the verified Clerk identity from each request. Clerk `user.created` and `user.updated` webhooks upsert profile fields in MongoDB; the user data endpoint can also create a profile on first access. Educator authorization is checked against Clerk public metadata.
2. **Course publishing:** An educator submits course data and an image. The server validates the educator, uploads the image to Cloudinary, then saves the course and returned image URL to MongoDB. Public catalog and course-detail endpoints read from MongoDB.
3. **Purchasing and enrollment:** The server saves a pending purchase before creating a Stripe Checkout Session. Session and PaymentIntent IDs are saved with that purchase. A verified Stripe webhook marks the purchase completed and adds the learner/course relationship to both the user and course documents. Enrollment updates use set semantics so webhook retries do not duplicate entries.
4. **Learning progress:** Progress is stored by Clerk user ID and course ID. The server verifies the learner is enrolled and the submitted lecture belongs to the course before recording completion. A unique compound index allows one progress document per learner/course.
5. **Educator reporting:** Dashboard and enrolled-learner endpoints read courses, purchases, and enrollment relationships from MongoDB.

## MongoDB Collections

| Model | Purpose | Important fields |
| --- | --- | --- |
| `User` | Clerk profile and learner enrollments | Clerk user ID as `_id`, `name`, `email`, `imageUrl`, `enrolledCourses` |
| `Course` | Published course, curriculum, ratings, and student IDs | Title, description, thumbnail URL, price, discount, educator ID, chapters/lectures, `courseRatings`, `enrolledStudents` |
| `Purchase` | Checkout and payment lifecycle | Course ID, Clerk user ID, amount, currency, Stripe Session/PaymentIntent IDs, status (`pending`, `completed`, `failed`) |
| `CourseProgress` | Learner lesson completion | User ID, course ID, completed lecture IDs, completion flag, timestamps |

Course and user references are intentionally mixed to match their source IDs: Clerk user IDs are strings; Mongo course IDs are ObjectIds in course/user references and strings in course-progress records.

## API Overview

All paths below are relative to the server origin, normally `http://localhost:5000`. User endpoints require a Clerk-authenticated request. Educator endpoints additionally require the `educator` Clerk role.

### Courses

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/course/all` | List published courses for the catalog |
| `GET` | `/api/course/:id` | Get a course and its curriculum |

### Educator

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/educator/update-role` | Set the signed-in user's Clerk role to educator |
| `POST` | `/api/educator/add-course` | Upload a thumbnail and create a course (`multipart/form-data`) |
| `GET` | `/api/educator/courses` | List the signed-in educator's courses |
| `DELETE` | `/api/educator/courses/:id` | Delete an owned course and remove enrollment/progress references |
| `GET` | `/api/educator/dashboard` | Get educator course, enrollment, and earnings totals |
| `GET` | `/api/educator/enrolled-students` | List learners with completed purchases |

### User And Learning

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/user/data` | Get or create the signed-in user's MongoDB profile |
| `POST` | `/api/user/purchase` | Create a pending purchase and Stripe Checkout Session |
| `GET` | `/api/user/enrolled-courses` | List the signed-in user's enrolled courses |
| `POST` | `/api/user/update-course-progress` | Mark an enrolled course lecture complete |
| `POST` | `/api/user/get-course-progress` | Read progress for an enrolled course |
| `POST` | `/api/user/add-rating` | Add or update an enrolled learner's course rating |

### Webhooks

| Method | Path | Provider |
| --- | --- | --- |
| `POST` | `/clerk` | Clerk user lifecycle events, verified with Svix |
| `POST` | `/stripe` | Stripe checkout/payment events, verified with the Stripe signature |

Webhook routes require raw request bodies for signature verification. The Express server configures these routes before its JSON API parsers.

## Local Development

Use two terminals from the repository root.

### 1. Configure the server

Copy `Server/.env.example` to `Server/.env` and fill in the server settings. Use a MongoDB database you can access, and keep credentials out of source control.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
# Optional: overrides the database name from MONGODB_URI
# MONGODB_DB=edusphere

CLERK_SECRET_KEY=<clerk-secret-key>
CLERK_WEBHOOK_SECRET=<clerk-svix-webhook-secret>

STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-signing-secret>
CURRENCY=USD

CLOUDINARY_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_SECRET_KEY=<cloudinary-api-secret>
```

`CURRENCY` is the three-letter ISO code used by Stripe, for example `USD` or `INR`. It is converted to lowercase when sent to Stripe.

### 2. Configure the client

Copy `Client/.env.example` to `Client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

`VITE_CURRENCY` is only the display symbol shown in the UI; it is separate from the server's Stripe currency code.

### 3. Install and run

```powershell
cd Server
npm install
npm run server
```

In another terminal, from the repository root:

```powershell
cd Client
npm install
npm run dev
```

Vite prints the local client URL, usually `http://localhost:5173`. The API health endpoint is `http://localhost:5000/` and returns `API Working` when the server is running.

### 4. Configure webhooks

- In Clerk, configure a webhook to send `user.created`, `user.updated`, and `user.deleted` events to `https://<public-server-origin>/clerk`. Copy its signing secret into `CLERK_WEBHOOK_SECRET`.
- In Stripe, configure a webhook for checkout completion and payment failure/expiration events at `https://<public-server-origin>/stripe`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
- For local Stripe testing, Stripe CLI can forward events to the local server: `stripe listen --forward-to localhost:5000/stripe`. Put the CLI's displayed signing secret in `STRIPE_WEBHOOK_SECRET` and restart the server.
- A webhook endpoint must be reachable by the provider. For local Clerk webhook testing, use a public tunnel or a deployed development endpoint.

Restart the relevant process after changing environment variables. Never commit real `.env` values.

## Deploy To Vercel

Deploy the client and server as **two Vercel projects from the same Git repository**. Each project uses its own subdirectory as the Root Directory, so each gets independent build settings and environment variables.

### Backend project

1. Import the repository into Vercel and set **Root Directory** to `Server`.
2. Keep the included `Server/vercel.json` configuration. It routes requests to the Express app, which is exported as a Vercel serverless handler. Local development still starts the same app with `npm run server`.
3. Add the server variables from `Server/.env.example` in the Vercel project's **Settings → Environment Variables**. Use production credentials for production deployments. Set `MONGODB_URI` to the intended database; `MONGODB_DB` is optional and overrides the database name in that URI.
4. Deploy, then confirm `https://<backend-domain>/` returns `API Working`.

### Frontend project

1. Create a second Vercel project from the same repository and set **Root Directory** to `Client`.
2. Use the Vite framework preset, build command `npm run build`, and output directory `dist`. The included `Client/vercel.json` rewrites client-side routes to the SPA entry point.
3. Add these variables in the frontend project's **Settings → Environment Variables**:

	```env
	VITE_BACKEND_URL=https://<backend-domain>
	VITE_CLERK_PUBLISHABLE_KEY=<production-clerk-publishable-key>
	VITE_CURRENCY=$
	```

	Use the backend's origin only in `VITE_BACKEND_URL` (no `/api` suffix and no trailing slash). Vite embeds `VITE_` variables at build time, so redeploy the frontend after changing one.
4. Deploy and test the frontend's production URL. Confirm course listings load from the backend domain and educator actions reach the same API.

### Connect production integrations

- In Clerk, add the frontend production domain to the Clerk application's allowed origins/domains. Point the Clerk webhook to `https://<backend-domain>/clerk` and use its production signing secret as `CLERK_WEBHOOK_SECRET`.
- In Stripe, point the production webhook to `https://<backend-domain>/stripe`, subscribe to the checkout completion and payment failure/expiration events handled by the server, and set the endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`.
- Confirm the MongoDB provider permits connections from the deployed Vercel backend. Keep database credentials and all secret keys in the Vercel backend environment settings, never in frontend variables or source files.
- If an environment variable changes in Vercel, redeploy the affected project. Frontend `VITE_` values belong only to the frontend project; MongoDB, Clerk secret, Stripe secret/webhook, and Cloudinary credentials belong only to the backend project.

### Post-deployment smoke check

1. Open the frontend production URL and confirm the public course catalog loads.
2. Sign in with Clerk and check that `/api/user/data` succeeds through the frontend.
3. As an educator, add a course and confirm it appears in the catalog and in MongoDB.
4. Complete a Stripe test-mode checkout and verify the purchase changes to `completed` and the learner appears in the enrolled course.
5. Open an enrolled course, complete a lesson, and confirm a `CourseProgress` document is created or updated.

## Project Structure

```text
EduSphere/
├── Client/
│   ├── src/
│   │   ├── components/       # Student and educator UI components
│   │   ├── context/          # Shared auth, catalog, and enrollment state
│   │   ├── pages/            # Student and educator routes
│   │   └── assets/           # Images, icons, and static course data
│   ├── package.json
│   ├── .env.example
│   ├── vercel.json
│   └── vite.config.js
├── Server/
│   ├── configs/              # MongoDB, Cloudinary, and upload setup
│   ├── controllers/          # Course, educator, user, and webhook handlers
│   ├── middlewares/          # Educator authorization
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API routes
│   ├── utils/                # Auth and Stripe helpers
│   ├── server.js
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── README.md
```

## Useful Commands

Run from `Client/`:

```powershell
npm run build
npm run lint
```

Run from `Server/`:

```powershell
npm run server
npm start
```

The server package currently has no automated test script. Backend syntax can be checked with Node, for example `node --check controllers/userController.js` from `Server/`.

## Interview Walkthrough

> EduSphere is a React course platform backed by an Express and MongoDB API. Clerk provides authentication and educator roles, while user lifecycle webhooks keep MongoDB profiles synchronized. Educators publish courses whose metadata and curriculum are stored as Mongo documents and whose thumbnails are hosted on Cloudinary. For paid enrollment, the API creates a pending purchase and a Stripe Checkout Session; a signature-verified webhook records payment completion and updates both the user and course enrollment lists. Learner progress is stored separately per user and course, validated against the learner's enrollment and the course's lecture IDs, and updated idempotently. The educator dashboard reads the same persisted course, purchase, and enrollment data.

## Design Notes

- A successful redirect from Stripe is not treated as proof of payment; the signed webhook is the authority for completing a purchase and granting access.
- Enrollment and lecture-progress writes are retry-safe to reduce duplicate data when requests or provider webhooks are repeated.
- Clerk, Stripe, MongoDB, and Cloudinary are external services; a full integration test requires valid development credentials and reachable webhook URLs.
