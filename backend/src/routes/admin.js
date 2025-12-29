const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/User");

/**
 * GET /api/admin/users
 * Query params: page, limit
 */
router.get("/users", auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * PUT /api/admin/users/:id/activate
 */
router.put("/users/:id/activate", auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User activated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate user" });
  }
});

/**
 * PUT /api/admin/users/:id/deactivate
 */
router.put("/users/:id/deactivate", auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deactivated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to deactivate user" });
  }
});

module.exports = router;
