function errorHandler(err,req,res){
     if(err.name === 'UnauthorizedError'){
         return res.status(401).json({message:err.message});
     }
     if(err.name === 'ValidationError'){
         return res.status(400).json({message:err.message});
     }
     if(err.name === 'MongoError'){
         return res.status(500).json({message:err.message});
     }
    return res.status(500).json({message:err.message});
}
module.exports = errorHandler;