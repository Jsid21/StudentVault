const jwt = require("jsonwebtoken");
module.exports =  {
  checkClientHeader : function(req, res, next){
    const clientId = req.headers['x-client-id'];
    const trustedClientId = process.env.CLIENT_ID; // Store this securely in an env file
    // console.log(clientId);
    // console.log(trustedClientId);
          
    if (!clientId || clientId !== trustedClientId) {
      return res.status(403).json({ error: "Unauthorized: Invalid client source" });
    }
  
    next();
  },
  validateId : function(req, res, next){
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }
    next();
  },
  authMiddleware : function(req,res,next){
    try {
      const token = req.cookies.auth_token; // Extract token from cookie
  
      if (!token) {
        return res.json({ loggedIn: false, message: "No token provided" });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to the request object
  
      next(); // Continue to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ loggedIn: false, message: "Invalid or expired token" });
    }
  }
};


