import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Role check
export const isMatron = (req, res, next) => {
  if (req.user.role !== "matron") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
