import jwt from "jsonwebtoken";

// Authenticate User Middleware
export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    console.log(req.user)// Attach user info (userId and role) to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Authorize Role Middleware
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role === requiredRole) {
      next(); // User has the required role
    } else {
      res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
  };
};

// Verify Token Middleware (For Additional Validation if Needed)



// Middleware to verify JWT token and authenticate the user
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(403).json({ error: 'No token provided.' });
  }

  try {
    // Decode the token and extract the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data (e.g., userId) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};


