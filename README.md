# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
out
## Project Setup

### 1. Environment Variables

Create a `.env.local` file in the root of your project. This file will store your secret keys.

```bash
cp .env .env.local
```

You will need to fill in the following values in your new `.env.local` file:

*   `MONGODB_URI`: Your MongoDB connection string. You can get this from your MongoDB Atlas dashboard or your local setup. It typically looks like `mongodb+srv://<user>:<password>@cluster.mongodb.net/<database_name>?retryWrites=true&w=majority`.
*   `JWT_SECRET`: A long, random, and secret string used for signing authentication tokens. You can generate one using an online tool or by running `require('crypto').randomBytes(64).toString('hex')` in a Node.js terminal.
*   `GOOGLE_API_KEY`: Your API key for Google AI Studio to enable Genkit features.

### 2. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

## Running Locally

To run this project on your local machine, you'll need to have Node.js and npm installed. You will need to run two separate processes in two different terminals.

1.  **Run the Genkit AI flows:**
    This process handles the AI-powered features like smart search and tag suggestions.
    ```bash
    npm run genkit:watch
    ```

2.  **Run the Next.js Application:**
    This is your main application.
    ```bash
    npm run dev
    ```

After these steps, your application should be running at `http://localhost:9002`.
