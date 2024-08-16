const router = require('express').Router();
const { User, Blog } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// Get all users with their blogs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Failed to create user' });
  }
});

// Get a user by username
router.get('/:username', async (req, res) => {
  const { read } = req.query;
  const readFilter = read === 'true' ? true : read === 'false' ? false : undefined;
  try {
    const user = await User.findOne({ 
      where: { username: req.params.username },
      attributes: { exclude: [] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId'] },
          through: {
            attributes: ['read', 'id'],
            where: readFilter !== undefined ? { read: readFilter } : {}

          }
        }
      ]
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a user by ID with an optional read filter
router.get('/:id', async (req, res) => {
  const { read } = req.query;
  const readFilter = read === 'true' ? true : read === 'false' ? false : undefined;
  console.log(`Fetching user with ID: ${req.params.id}`); 
  try {
    const user = await User.findOne({ 
      where: { id: req.params.id},
      attributes: { exclude: [] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId'] },
          through: {
            attributes: ['read', 'id'],
            where: readFilter !== undefined ? { read: readFilter } : {}

          }
        }
      ]
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Update a user's name
router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (user) {
      user.name = req.body.name;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user.admin) {
      return res.status(401).json({ error: 'Operation not allowed' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Admin can disable a user
router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    });

    if (user) {
      user.disabled = req.body.disabled;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
