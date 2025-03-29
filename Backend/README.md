# Backend of IndianArtMate

## Overview
The backend of IndianArtMate is built using Node.js and Express.js. It handles API requests and manages data interactions with the MongoDB database. The backend is designed to be scalable and secure, providing a robust foundation for the application.

## Installation Instructions
To set up the backend environment, follow these steps:
1. Clone the repository.
2. Navigate to the Backend directory.
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage Examples
Here are some example API requests you can use to interact with the backend:

- **Authentication**:
  ```bash
  POST /api/auth/login
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

- **Get User Posts**:
  ```bash
  GET /api/post
  ```

## Error Handling
The API returns standard HTTP status codes to indicate the success or failure of requests. For example:
- 200 OK: Request was successful.
- 401 Unauthorized: Authentication failed.
- 404 Not Found: The requested resource was not found.

## Testing
To run tests for the backend, use the following command:
```bash
npm test
```


## Main Server
The main server file is `server.js`, which sets up the Express application and defines various routes for handling requests.

## Routes
- **Authentication**: `/api/auth` - Handles user authentication.
- **Posts**: `/api/post` - Manages user posts.
- **Cart**: `/api/cart` - Manages shopping cart functionality.
- **Orders**: `/api/order` - Handles order processing.
- **Images**: `/images` - Serves static image files.

## Dependencies
- Express
- Mongoose
- Socket.io
- dotenv
- cors

## Running the Server
To start the backend server, run:
```bash
npm run server
