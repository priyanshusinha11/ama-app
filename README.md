# Whisperly - Anonymous Messaging Application

Whisperly is a modern anonymous messaging application that allows users to receive messages anonymously via unique links. The app features user authentication, channels for organizing messages, and stories functionality with AI-powered message suggestions.

## Live Demo

You can try out the live version of Whisperly here: [Whisperly Live](https://whisperly-beta.vercel.app/)

## Features

- **Anonymous Messaging:** Users can receive messages anonymously through unique links
- **User Authentication:** Secure sign-up and login with email verification
- **Channels:** Create dedicated channels for different types of messages
- **Stories:** Share temporary content that expires after 24 hours
- **AI-Generated Suggestions:** Integrated with Google Generative AI to provide intelligent message suggestions
- **Responsive Design:** Modern UI built with Tailwind CSS and ShadCN UI components

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS with ShadCN UI
  - Framer Motion for animations
  - Embla Carousel for carousels
- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database
- **Authentication:**
  - NextAuth.js
- **AI Integration:**
  - Google Generative AI (@ai-sdk/google)

## Getting Started

To get started with Whisperly locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (or use a cloud-based PostgreSQL service)
- [npm](https://www.npmjs.com/) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/priyanshusinha11/ama-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ama-app
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/ama_app"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_API_KEY="your-google-api-key"
   RESEND_API_KEY="your-resend-api-key"
   ```

5. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

6. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at http://localhost:3000

## Database Schema

The application uses PostgreSQL with Prisma ORM and includes the following models:

- **User:** User authentication and profile information
- **Account:** OAuth account information
- **Session:** User session data
- **Message:** Messages sent to users
- **Channel:** Channels created by users for receiving messages
- **Story:** Temporary content that expires after a set time
- **Like:** Likes on stories
- **VerificationToken:** Email verification tokens

## Deployment

Whisperly is currently deployed on Vercel and can be accessed at: [https://whisperly-beta.vercel.app/](https://whisperly-beta.vercel.app/)

To deploy Whisperly yourself, you can use Vercel or any other platform that supports Next.js applications:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy the application

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
