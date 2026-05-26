/**
 * Health check controller.
 * Simple endpoint to confirm the Express backend is running and operational.
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend working"
  });
};

module.exports = {
  getHealth
};
