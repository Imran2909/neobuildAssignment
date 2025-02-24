const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    // To check wether token is passed or not
    const tokenBody = req.headers.authorization
    if(!tokenBody){
      return res.status(401).json({ error: "Please pass token in headers" });
    }
    let token
    // To check wether token is passes with "Bearer" or not
    if(req.headers.authorization.split(" ")[1]){
      token = req.headers.authorization.split(" ")[1]
    }else{
      return res.status(401).json({ error: "Add Bearer prefix to token" });
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token verification failed
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // Token is valid, attach decoded payload to the request object
      req.user = decoded;
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authMiddleware;


