# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setting up your Gemini API Key

This project uses the Gemini API from Google AI for its smart search and tag suggestion features. To run the application locally, you'll need to provide your own API key.

1.  **Get an API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create your free API key.

2.  **Create a `.env.local` file**: In the root directory of the project, create a new file named `.env.local`.

3.  **Add the key to the file**: Add the following line to your `.env.local` file, replacing `YOUR_API_KEY` with the key you just created:
    ```
    GOOGLE_API_KEY=YOUR_API_KEY
    ```

The application is configured to automatically load this key for the Genkit AI flows.

## Running Locally

To run this project on your local machine, you'll need to have Node.js and npm installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Genkit AI flows:**
    In a separate terminal, start the Genkit development server. This process handles the AI-powered features like smart search and tag suggestions.
    ```bash
    npm run genkit:watch
    ```

3.  **Run the Next.js Application:**
    In another terminal, start the Next.js development server. This is your main application.
    ```bash
    npm run dev
    ```

After these steps, your application should be running at `http://localhost:9002`.
