/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error:   message,
    path:    req.path,
    method:  req.method,
    timestamp: new Date().toISOString(),
  });
}

module.exports = errorHandler;
