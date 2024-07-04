module.exports = function(error, req, res, next) {    
  console.dir({error}, {depth: null});
  res.status(500).json({
    error: {
      message: 'Internal server error',
      stack: error.stack
    }
  });
}
