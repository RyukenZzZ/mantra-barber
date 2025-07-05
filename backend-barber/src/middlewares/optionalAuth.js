const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/users");

exports.optionalAuthorization = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userRepository.getUserById(decoded.user_id);
      if (user) req.user = user;
    } catch (err) {
      // Jika token invalid, biarkan req.user undefined
    }
  }
  next();
};
