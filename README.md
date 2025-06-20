# Splinx Backend

## Description

This is the backend service for the Splinx application, providing APIs for user management, real-time chat, payment processing, and more.

## Features

- User authentication and authorization (JWT-based)
- Profile management
- Real-time chat functionality using Socket.io
- Payment integration with Flutterwave
- Event creation and management
- Community features (posts, comments, likes)
- Admin panel for managing users and content
- Lead generation
- Email notifications
- Wallet system
- Subscription plans
- Promo codes
- Secure file uploads to Cloudinary
- API documentation using Swagger

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.io
- Flutterwave API
- Cloudinary API
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)
- Nodemailer (for email sending)
- Winston (for logging)
- Swagger (for API documentation)
- Helmet (for security headers)
- CORS
- Multer (for file uploads)
- Axios (for HTTP requests)
- body-parser
- dotenv

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd splinx-backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add the necessary environment variables (see Environment Variables section).
5. Start the server: `npm start` or `npm run dev` (for development)

## API Documentation

API documentation is generated using Swagger.
- To generate/update the documentation: `npm run swagger`
- Access the documentation at `/api-docs` endpoint when the server is running (e.g., `http://localhost:PORT/api-docs`).

## Environment Variables

Create a `.env` file in the root of the project and add the following variables:
- `PORT`: The port the application will run on (e.g., 3000)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `FLUTTERWAVE_PUBLIC_KEY`: Your Flutterwave public key
- `FLUTTERWAVE_SECRET_KEY`: Your Flutterwave secret key
- `FLUTTERWAVE_ENCRYPTION_KEY`: Your Flutterwave encryption key
- `EMAIL_HOST`: SMTP host for sending emails
- `EMAIL_PORT`: SMTP port for sending emails
- `EMAIL_USER`: Username for SMTP authentication
- `EMAIL_PASS`: Password for SMTP authentication
- `TEXTFLOW_API_KEY`: API key for TextFlow (if used for SMS)

## Running the Application

- To start the server: `npm start`
- To run in development mode (with automatic restarts): `npm run dev`

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## License

This project is licensed under the ISC License.
