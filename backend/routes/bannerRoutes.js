const router = require("express").Router();
const bannerController = require("../controllers/bannerController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/banner/add", authMiddleware, bannerController.add_banner);

module.exports = router;
