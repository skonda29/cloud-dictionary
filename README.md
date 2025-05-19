

# Serverless Cloud Dictionary

## Overview

The Serverless Cloud Dictionary is a web application that allows users to manage cloud computing terms and their definitions. Built with a serverless architecture, it enables users to **add**, **search**, and **list** terms through an intuitive interface. The application is deployed at `https://dev.d4zhh6t9lhrmu.amplifyapp.com` and uses AWS services for scalability and reliability.

### Features

- **Add Terms**: Users can add new cloud computing terms and their definitions.
- **Search Terms**: Search for a specific term to view its definition.
- **List All Terms**: View all terms in a responsive table on a dedicated page, with column widths adjusting dynamically to content length.
- **Responsive Design**: The UI is user-friendly and adapts to different screen sizes.

## Technologies Used

- **Frontend**: React, React Router, CSS
- **Backend**: AWS Amplify, API Gateway, Lambda, DynamoDB
- **Version Control**: Git, GitHub
- **Deployment**: Amplify Hosting

## Project Structure

```
cloud-dic/
├── amplify/                    # Amplify configuration files
├── public/                     # Static files (e.g., index.html)
├── src/                        # React source code
│   ├── App.js                  # Main app component with search/add functionality
│   ├── App.css                 # Styles for the main page
│   ├── AllTermsPage.js         # Component for the All Terms page with table
│   ├── AllTermsPage.css        # Styles for the All Terms table
│   ├── aws-exports.js          # Amplify configuration (not tracked in Git)
│   └── index.js                # Entry point with React Router setup
├── .gitignore                  # Files/folders to ignore in Git
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## Setup Instructions

Follow these steps to set up and run the project locally or deploy it to AWS.

### Prerequisites

- **Node.js and npm**: Install from `https://nodejs.org/` (e.g., v20 or higher).
- **AWS Account**: Sign up at `https://aws.amazon.com/` (free tier recommended).
- **AWS Amplify CLI**: Install globally with `npm install -g @aws-amplify/cli`.
- **Git**: Install from `https://git-scm.com/`.
- **VS Code**: Recommended editor, available at `https://code.visualstudio.com/`.

### Clone the Repository

1. Clone the repository from GitHub:
   ```
   git clone https://github.com/skonda29/cloud-dictionary.git
   cd cloud-dictionary
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Configure AWS Amplify

1. **Initialize Amplify**:
   - Run:
     ```
     amplify init
     ```
   - Follow the prompts:
     - Project name: `clouddictionary`
     - Environment: `dev`
     - Default editor: `Visual Studio Code`
     - App type: `javascript`
     - Framework: `react`
     - Source Directory: `src`
     - Distribution Directory: `build`
     - Build command: `npm run build`
     - Start command: `npm run start`
     - AWS Profile: Select your configured profile (set up with `amplify configure`).
2. **Add Backend Resources**:
   - **Storage (DynamoDB)**:
     ```
     amplify add storage
     ```
     - Select **NoSQL Database**.
     - Name: `DictionaryTable`.
     - Primary key: `term` (string).
     - Add attribute: `definition` (string).
     - No sort key, indexes, triggers, or restricted access.
   - **API (API Gateway and Lambda)**:
     ```
     amplify add api
     ```
     - Select **REST**.
     - Name: `DictionaryAPI`.
     - Path: `/terms`, Lambda: `lookupTermFunction`, open access, enable CORS.
     - Add path: `/terms/{term}`, Lambda: `lookupTermFunction`, open access, enable CORS.
   - **Lambda Function**:
     - Ensure `amplify/backend/function/lookupTermFunction/src/index.js` matches the code provided in the project (handles GET `/terms`, GET `/terms/{term}`, POST `/terms`).
3. **Deploy Backend**:
   ```
   amplify push
   ```

### Run Locally

1. Start the React development server:
   ```
   npm start
   ```
2. Open `http://localhost:3000` in your browser.
3. Test the app:
   - Search for a term (e.g., `serverless`).
   - Add a term (e.g., `SNS` with definition `A notification service by AWS.`).
   - Click the "All Terms" button to view all terms in a table at `/all-terms`.

### Deploy to Amplify Hosting

1. **Add Hosting**:
   ```
   amplify hosting add
   ```
   - Select **Manual deployment**.
2. **Build and Deploy**:
   ```
   npm run build
   cd build
   zip -r ../build-root.zip .
   cd ..
   ```
   - Upload `build-root.zip` to Amplify Hosting:
     - Go to `https://console.aws.amazon.com/amplify/home`.
     - Select your app.
     - Under the `dev` branch, click **Upload build artifact**.
     - Upload `build-root.zip` and deploy.
3. Access the deployed app at `https://dev.d4zhh6t9lhrmu.amplifyapp.com`.

## Usage

- **Add a Term**:
  - On the main page, enter a term (e.g., `EKS`) and definition (e.g., `A managed Kubernetes service by AWS.`), then click "Add Term".
- **Search a Term**:
  - Enter a term (e.g., `S3`) in the "Enter term" field and click "Search Term" to view its definition.
- **List All Terms**:
  - Click the "All Terms" button to navigate to `/all-terms`, where terms are displayed in a responsive table.
