const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const excludePaths = require('./helpers/excludePaths');
const errorHandler = require('./helpers/error-handler');
const cors = require('cors');
const api = process.env.API_URL;

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// Define paths to exclude with correct structure
const excludedPaths = [
    { url: `${api}/users/login`, methods: ['POST'] },
    { url: `${api}/users/signup`, methods: ['POST'] }
];

// Use the custom excludePaths middleware
//app.use(excludePaths(excludedPaths, authJwt));

app.use(errorHandler);

// Routers
const userRouter = require('./routers/users');
const userPlaceRouter = require('./routers/userPlaces');
const publicPlaceRouter = require('./routers/swimmingPlaces');

app.use(`${api}/users`, userRouter);
app.use(`${api}/userplaces`, userPlaceRouter);
app.use(`${api}/publicplaces`, publicPlaceRouter);

// Database connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Avantosilakka'
})
.then(() => {
    console.log('Database Connection is ready');
})
.catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log(api);
    console.log('Server is running at http://localhost:3000');
});
