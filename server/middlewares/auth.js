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


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  try {
    console.log("Token received:", token); // Log the received token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err); // Log the error
    res.status(401).json({ error: "Invalid token." });
  }
};

