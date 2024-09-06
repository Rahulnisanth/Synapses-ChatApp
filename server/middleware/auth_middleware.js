import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt;
  if (!token) return response.status(401).send("Authentication required.");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return response.status(403).send("Invalid token.");

    request._id = payload.user_id;
    next();
  });
};
