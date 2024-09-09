# Whisperply - Anonymous Messaging App

Whisperply is an anonymous messaging application that allows users to receive messages anonymously via unique links. The app features email verification for secure sign-ups and leverages AI to generate message suggestions.

## Live Demo

You can try out the live version of Whisperply here: [Whisperply Live](https://whisperly-beta.vercel.app/)

## Features

- **Anonymous Messaging:** Users can receive messages anonymously through unique links.
- **AI-Generated Suggestions:** Integrated with Gemini AI to provide intelligent message suggestions.
- **Dashboard:** A user-friendly dashboard to view received messages.

## Tech Stack

- **Frontend:** 
  - Next.js
  - Tailwind CSS with ShadCN UI
- **Backend:**
  - Node.js
  - Express.js
- **Database:**
  - MongoDB (Mongoose)
- **AI Integration:**
  - Gemini AI

## Getting Started

To get started with Whisperply locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development, or use a cloud-based MongoDB service)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) (or npm)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/priyanshusinha11/ama-app.git

2. Navigate to the project directory:

 ```bash
   cd ama-app 
   ``` 
3. Install dependencies
```bash
yarn install
# or
npm install
```
4. Set up env variables
```bash
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
GEMINI_API_KEY=your_gemini_api_key
```
5. Run the development server
```bash
yarn dev
# or
npm run dev
```
The app will be available at http://localhost:3000

### Deployment

To deploy Whisperply, you can use Vercel or any other platform that supports Next.js applications. Follow the platform's deployment instructions to get your app live.

#### Try: 
Live link: https://whisperly-beta.vercel.app/

### Contributing

Contributions are welcome! Please follow these guidelines:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Create a new Pull Request.

