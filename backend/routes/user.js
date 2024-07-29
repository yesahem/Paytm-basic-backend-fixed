const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SEC = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: " incorrect inputs",
    });
  }
  const user = User.findOne({
    username: body.username,
  });
  if (user._id) {
    return res.json({
      message: "Email already taken",
    });
  }

  const dbUser = await User.create({
    username: body.username,
    password: body.password,
    firstname: body.firstname,
    lastname: body.lastname,
  });
  const userId = dbUser._id;
  // ------ Creating Account ---------
  await Account.create({
    userId,
    balance: Math.floor(Math.random() * 10000 + 1),
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SEC,
  );
  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const body = req.body;
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: " incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SEC,
    );

    res.json({
      token: token,
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Updated successfully",
  });
});
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      _id: user._id,
    })),
  });
});

module.exports = router;
