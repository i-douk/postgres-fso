const router = require('express').Router();
const { User, Blog } = require('../models');
const { tokenExtractor , isAdmin } = require('../util/middleware');

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
      attributes: { exclude: [''] },
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
  

    const user = await User.findOne({ 
      where: { id: req.params.id},
      attributes: { exclude: [''] },
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
