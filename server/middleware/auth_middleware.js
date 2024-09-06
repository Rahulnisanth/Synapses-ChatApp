import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt;
  if (!token) return response.status(401).send("You are not authenticated.");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err);
      return response.status(403).send("Token is not valid.");
    }
    console.log("JWT Payload:", payload);
    request._id = payload.user_id;

    next();
  });
};
