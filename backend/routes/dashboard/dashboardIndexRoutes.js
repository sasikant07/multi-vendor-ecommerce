const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const {
  get_seller_dashboard_index_data,
  get_admin_dashboard_index_data,
} = require("../../controllers/dashboard/dashboardIndexController");

router.get(
  "/seller/get-dashboard-index-data",
  authMiddleware,
  get_seller_dashboard_index_data
);
router.get(
  "/admin/get-dashboard-index-data",
  authMiddleware,
  get_admin_dashboard_index_data
);

module.exports = router;
