'use strict';

module.exports = (req, res, next) => {
  req.data.hasActiveFilter = Object.keys(req.query).some(key => key !== 'aggregations'); 
  next();
};
