function errorHandler(error, req, res, next){
    let status = 500
    let message = 'Internal Server Error'

    if (error.name == "SequelizeUniqueConstraintError") {
        status = 400;
        message = error.errors[0].message;
      }
    
      if (error.name == "SequelizeValidationError") {
        status = 400;
        message = error.errors[0].message;
      }
    
      if (error.name == "SequelizeDatabaseError") {
        status = 400;
        message = "Invalid Input";
      }
    
      if (error.name == "SequelizeForeignKeyConstraintError") {
        status = 400;
        message = "Invalid Input";
      }

      if (error.name == "TokenExpiredError") {
        status = 401;
        message = "Token already expired please login again";
      }

      if (error.name == "UNAUTHENTICATED") {
        status = 401;
        message = "Invalid username/password";
      }
    
      if (error.name == "JsonWebTokenError") {
        status = 401;
        message = "Invalid username/password";
      }

      if (error.name == "UNAUTHORIZED") {
        status = 403;
        message = `You don't have the permission`;
      }

      
    if(error.name == 'nullBookmark'){
        status = 404
        message = "No bookmarked manga IDs found for this user."
    }

    if(error.name == 'NMF'){
        status = 404
        message = 'No Manga Found'
    }

    if(error.name == 'AE'){
        status = 400
        message = 'Bookmark already exist'
    }

    if(error.name == 'BNE'){
        status = 404
        message = 'Bookmark Not Exist'
    }

    if(error.response){
        status = error.response.status
        message = 'Manga Not Exist'
    }

    res.status(status).json({
        message
    })

    console.log(error.response);
}

module.exports = errorHandler