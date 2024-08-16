const router = require('express').Router()

const { User, Blog , Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include : {
      model : Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:username', async (req, res) => {
  const user = await User.findOne({ 
    where: { username: req.params.username},
    attributes: { exclude: [''] } ,
    include:[{
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId']},
        through: {
          attributes: ['read','id']
        }
      },
    ]
  })
  console.log(user)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username} })
  console.log(user)
  if (user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

// router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: req.params.username
//     }
//   })

//   if (user) {
//     user.disabled = req.body.disabled
//     await user.save()
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

module.exports = router