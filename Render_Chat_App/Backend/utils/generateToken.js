import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, // prevents xss attacks from client-side javascript from accessing the cookie
    secure: process.env.NODE_ENV !== "development", // ensures the cookie is only sent over HTTPS in production
    sameSite: "strict", // csrf cross-site request forgery protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};

export default generateTokenAndSetCookie;
