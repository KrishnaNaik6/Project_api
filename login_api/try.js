// // const express = require('express');
// // const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcryptjs');

// // const app = express();
// // app.use(express.json());

// // const users = [
// //     { id: 1, username: 'user1', password: '$2a$10$SdRiUeD5XIrWboW2ieSYj.HqAYDxaEzLDrvM/NSK/kb7VWq7lASFe' } // Password is 'password'
// // ];



// // const secretKey = 'secret'; // Secret key for JWT

// // // Endpoint for user login
// // app.post('/login', (req, res) => {
// //     const { username, password } = req.body;
// //     const user = users.find(u => u.username === username);
// //     if (!user || !bcrypt.compare(password, user.password)) {
// //         return res.status(401).json({ message: 'Invalid username or password' });
// //     }
// //     const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
// //     res.json({ token });
// // });

// // // Middleware to verify token
// // const verifyToken = (req, res, next) => {
// //     const token = req.headers.authorization;
// //     if (!token) {
// //         return res.status(401).json({ message: 'Unauthorized' });
// //     }
// //     jwt.verify(token, secretKey, (err, decoded) => {
// //         if (err) {
// //             return res.status(401).json({ message: 'Unauthorized' });
// //         }
// //         req.userId = decoded.userId;
// //         next();
// //     });
// // };

// // // Protected endpoint
// // app.get('/protected', verifyToken, (req, res) => {
// //     res.json({ message: 'Protected endpoint accessed successfully', userId: req.userId });
// // });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });

// // -----------------------------------------------------------

// // const jwt = require('jsonwebtoken');

// // // Generate a long-term token (refresh token) with user ID and password
// // const generateLongTermToken = (userId, password) => {
// //     // Define payload (user ID and password)
// //     const payload = {
// //         userId,
// //         password,
// //     };

// //     // Generate token with one-week validity
// //     const refreshToken = jwt.sign(payload, 'your_secret_key', { expiresIn: '1w' });

// //     return refreshToken;
// // };

// // // Example usage:
// // const userId = 'user123';
// // const password = 'password123';
// // const longTermToken = generateLongTermToken(userId, password);
// // console.log('Long-term token:', longTermToken);


// // ------------------------------------------------------------------....
// // require('crypto').randomBytes(48, function(err, buffer) {
// //   var token = buffer.toString('hex');

// // });

// const crypto = require('crypto')
// // const toke = cryp.randomBytes(48, (err, buffer)=>{
// //     var token = buffer.toString('hex')
// //     return buffer
// // })
// // console.log(toke)

// // const crypto = require('crypto');

// const jwt = require('jsonwebtoken');

// // Define a function to generate a refresh token
// const generateRefreshToken = (userId, expiresIn) => {
//     // Define payload (user ID)
//     const payload = {
//         userId,
//     };

//     // Generate token with specified expiration time (1 week)
//     const refreshToken = jwt.sign(payload, 'refresh_token_secret', { expiresIn });

//     return refreshToken;
// };

// // Usage example:
// const userId = 'user123';
// const expiresIn = '7d'; // 1 week (7 days)
// const refreshToken = generateRefreshToken(userId, expiresIn);
// console.log('Refresh token:', refreshToken);



// // // validity chek

// // // Define a function to check the validity of a refresh token
// // const checkRefreshTokenValidity = (refreshToken, refreshKey) => {
// //     try {
// //         // Verify the signature of the refresh token
// //         const decodedToken = jwt.verify(refreshToken, refreshKey);

// //         // Check if the token has expired
// //         if (decodedToken.exp < Date.now() / 1000) {
// //             return {
// //                 valid: false,
// //                 reason: 'Token has expired'
// //             };
// //         }

// //         // Token is valid
// //         return {
// //             valid: true,
// //             userId: decodedToken.userId
// //         };
// //     } catch (error) {
// //         // Token verification failed
// //         return {
// //             valid: false,
// //             reason: 'Token verification failed'
// //         };
// //     }
// // };

// // // Example usage:
// // // const refreshToken = 'your_refresh_token';
// // const refreshKey = 'refresh_token_secret';

// // const tokenValidity = checkRefreshTokenValidity(refreshToken, refreshKey);
// // if (tokenValidity.valid) {
// //     console.log('Refresh token is valid for user ID:', tokenValidity.userId);
// //     console.log(tokenValidity.valid)

// // } else {
// //     console.error('Refresh token is not valid:', tokenValidity.reason);
// // }



// // ?-------------------------------
// // const jwt = require('jsonwebtoken');

// // Define the refresh token
// // const refreshToken = 'your_refresh_token';

// // Decode the refresh token to access its claims
// const decodedToken = jwt.decode(refreshToken);

// // Check if the token is valid (not expired)
// if (decodedToken && decodedToken.exp) {
//     const expirationTimeInSeconds = decodedToken.exp;
//     const expirationDate = new Date(expirationTimeInSeconds * 1000); // Convert from seconds to milliseconds
//     const currentDate = new Date();

//     if (expirationDate > currentDate) {
//         console.log('Refresh token is valid. Expires at:', expirationDate);
//     } else {
//         console.log('Refresh token has expired.');
//     }
// } else {
//     console.log('Invalid refresh token.');
// }

// // Check the day of creation (if available)
// if (decodedToken && decodedToken.iat) {
//     const creationTimeInSeconds = decodedToken.iat;
//     const creationDate = new Date(creationTimeInSeconds * 1000); // Convert from seconds to milliseconds
//     console.log('Refresh token was created on:', creationDate);
// } else {
//     console.log('Creation time not available in the token.');
// }
// Create a new Date object without passing any arguments
const currentTime = new Date();

// Get individual components of the current time (hour, minute, second)
const hour = currentTime.getHours();
const minute = currentTime.getMinutes();
const second = currentTime.getSeconds();

// Construct the formatted time string
const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

// Display the current time
console.log('Current Time:', formattedTime);
