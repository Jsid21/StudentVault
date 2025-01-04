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
};