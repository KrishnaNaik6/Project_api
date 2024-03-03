const express = require('express')
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const { couldStartTrivia } = require('typescript');
const prisma = new PrismaClient();

//bcrypt for password
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// for Token
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { error } = require('console');

const refresh_secret_key = "myrefsecret_key"
const sess_secret_key = "myaccsecret_key"

//generate secret key
function secret_key() {
    const buffer = crypto.randomBytes(10); //gerate random bytes

    const sec_key = buffer.toString('hex');// Convert  buffer to a hexadecimal string
    return sec_key;
}

//generate Refresh token
const generateRefreshToken = (userId, expiresIn) => {
    // Define payload (user ID)
    const payload = {
        userId
    };


    // Generate token with specified expiration time (1 week)
    const refreshToken = jwt.sign(payload, refresh_secret_key, { expiresIn });

    return { "r_token": refreshToken };
};

// check validity
const checkRefreshTokenValidity = (refreshToken) => {
    try {

        const decodedToken = jwt.decode(refreshToken);

        // Check if the token is valid (not expired)
        if (decodedToken && decodedToken.exp) {
            const expirationTimeInSeconds = decodedToken.exp;
            const expirationDate = new Date(expirationTimeInSeconds * 1000); // Convert from seconds to milliseconds
            const currentDate = new Date();

            if (expirationDate > currentDate) {
                console.log('Refresh token is valid. Expires at:', expirationDate);
                return {
                    valid: true,
                    userId: decodedToken.userId,
                    token: decodedToken
                };
            } else if (expirationDate == currentDate) {
                console.log("expires today")
                return {
                    valid: true,
                    userId: decodedToken.userId,
                    token: decodedToken
                };
            }
            else {
                console.log('Refresh token has expired.');
            }
        } else {
            console.log('Invalid refresh token');
        }


        // Token is valid

    } catch (error) {
        // Token verification failed
        return {
            valid: false,
            reason: 'Token verification failed'
        };
    }
};

// generate session token with refreshtoken
const generateSessionToken = (refreshToken, sessionValidity) => {
    try {
        // Set expiration time to 1 minute from the current time
        //  const expirationTime = Math.floor(Date.now() / 1000) + 60; // Current time + 60 seconds

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, refresh_secret_key);

        // Extract user ID or any other relevant information from the refresh token
        const userId = decoded.userId;

        // Generate a new session token for the user with the specified validity period
        const sessionToken = jwt.sign({ userId }, sess_secret_key, { expiresIn: sessionValidity });

        return sessionToken;
    } catch (error) {
        console.error('Error generating session token:', error);
        return null; // Return null if unable to generate session token
    }
};

// Function to validate a session token
const validateSessionToken = (sessionToken, secretKey) => {
    try {
        // Verify the session token and decode its payload
        const decoded = jwt.verify(sessionToken, secretKey);

        // Check expiration time (if present)
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return false; // Token has expired
        }

        return true; // Token is valid
    } catch (error) {
        console.error('Error validating session token:', error.message);
        return false; // Token validation failed
    }
};

// check if the user already has any session
function get_session(user_id) {
    return prisma.session.findFirst({
        where: {
            userid: user_id,
        }
    });
}

//-----REQUESTS ------

router.get('/', async (req, res) => {
    console.log(req.headers)
    console.log(req.params)
    res.send("done")
})

router.put('/', async (req, res) => {
    try {
        const phNo = req.body.phNo;

        var salt = 10;
        req.body.Password = bcrypt.hashSync(req.body.Password, salt);
        console.log(req.body)
        if (phNo.length != 10) {
            return res.status(400).send("Invalid or missing phone number. Phone number length should be 10 digits.");
        }
        const user = await prisma.login.create({
            data: req.body
        });

        res.status(201).send("Insertion success");
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await prisma.login.findMany(
            {
                where: {
                    firstName: {
                        contains: req.body.firstName,
                    },
                    email: {
                        contains: req.body.email,
                    }
                }
            }
        )
        if (user.length != 0) {
            for (i in user) {
                const userId = user[i].userid
                bcrypt.compare(req.body.Password, user[i].Password).then((result) => {
                    if (result == true) {
                        get_session(userId)
                            .then(session => {
                                if (session) {
                                    let valid_token = checkRefreshTokenValidity(session.refreshToken, refresh_secret_key)
                                    if (valid_token) {
                                        res.send("valid refresh token")
                                        return

                                    } else {
                                        res.status(401).send({error: "expired token"})

                                    }
                                } else {
                                    // if no sessions found
                                    const ses = prisma.session.create(
                                        {
                                            data: {
                                                userid: userId,
                                                refreshToken: generateRefreshToken(userId, "1w").r_token,
                                            }
                                        }
                                    )
                                        .then(ses => {
                                            console.log(ses)
                                            res.status(201).send(ses)
                                            return
                                        })
                                }
                            })
                            .catch(error => {
                                res.send(error);
                            });

                    } else {
                        res.send("User not exists")
                    }
                });

            }

        } else {
            res.send('No such users')
        }
    } catch (error) {
        res.send(error)
    }
})

router.post('/regenerate', async (req, res) =>{
    try{
        const token = req.headers['authorization']

        const sess_tok = generateSessionToken(token, "2h");

        res.status(200).json({sess_tok})
    }catch(error){

    }
})

// Middleware to verify session token
const verifySessionToken = (req, res, next) => {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify session token
    jwt.verify(sessionToken, sess_secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = { userId: decoded.userId }; // Attach user ID to request object
        next(); // Proceed to the next middleware or route handler
    });
};

router.get('/profile', verifySessionToken, (req, res) => {
    // Return user profile data
    res.json({ userId: req.user.userId});
});



router.delete('/', async (req, res) => {
})

// -----------------------------------------------------------------------


module.exports = router;