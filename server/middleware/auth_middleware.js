import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt;
  if (!token) return response.status(401).send("You are not authenticated.");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err);
      return response.status(403).send("Token is not valid.");
    }

    // Log the payload for debugging
    console.log("JWT Payload:", payload);

    // Ensure that payload contains user_id and assign it to request
    request._id = payload.user_id;

    // Continue to next middleware
    next();
  });
};
