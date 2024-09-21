import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt; // Ensure 'jwt' is the correct cookie name
  if (!token) {
    return response.status(401).send("You are not authenticated."); // 401: Unauthorized
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err);
      return response.status(403).send("Token is not valid."); // 403: Forbidden
    }

    console.log("JWT Payload:", payload);
    request.user_id = payload.user_id;

    next();
  });
};
