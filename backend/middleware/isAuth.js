const jwt = require("jsonwebtoken");

// Since public pages can be retrieved by anybody, we don't throw any errors
// in the authentication middleware. We have further authorization checks when
// we load the page from the database.

module.exports = (req, res, next) => {
  if(req.cookies !== undefined)
  {
    const { token } = req.cookies;
    console.log(token);
    if (token) {
      const { userId } = jwt.verify(token, process.env.JWT_KEY);
      req.userId = userId;
    }
  }
  next();
};
