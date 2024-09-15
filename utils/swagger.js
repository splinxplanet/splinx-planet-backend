const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Splinx Planet API Documentation",
    description: "The Splinx Planet API provides seamless access to features such as event management, bill splitting, wallet transactions, and user interactions. This documentation serves as a comprehensive guide for developers to integrate and manage these functionalities within the Splinx Planet mobile app. With endpoints for events, payments, user profiles, and notifications, our API enables efficient and scalable interactions across the platform."
},
  host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = [
    '../routes/adminRoutes.js',
    '../routes/authRoutes.js',
    '../routes/communityRoutes.js',
    '../routes/eventRoutes.js',
    '../routes/messageRoutes.js',
    '../routes/postRoutes.js',
    '../routes/splinxWalletRoutes.js',
    '../routes/userRoutes.js',
    '../routes/withdrawalRoutes.js',
];


swaggerAutogen(outputFile, routes, doc);