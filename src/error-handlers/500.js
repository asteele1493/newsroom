function serverError ()  {
  ((err, req, res, next) => {
    res.status(500).send({ message : 'There was a problem!', err});
    });
  }
  
    module.exports = serverError;