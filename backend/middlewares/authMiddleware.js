const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({error: "Please login first"});
  } else {
    try {
        const decodeToken = await jwt.verify(accessToken, process.env.SECRET);  // return id and role from the authController admin_login ()
        req.role = decodeToken.role;    // set role to request
        req.id = decodeToken.id;        // set id to request
        next();
    } catch (error) {
        return res.status(401).json({error: "Please login"});
    }
  }
};
