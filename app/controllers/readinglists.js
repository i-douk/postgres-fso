const router = require('express').Router()
const { Readinglist } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  if (req.decodedToken.id !== req.body.userId) {
    return res
      .status(401)
      .json({ error: 'You are not the owner of this reading list!' })
  }

  const readingListAddition = await Readinglist.create(req.body)

  res.status(201).send(readingListAddition)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListEntry = await Readinglist.findByPk(req.params.id)

  if (req.decodedToken.id !== readingListEntry.userId) {
    return res
      .status(401)
      .json({ error: 'You are not the owner of this reading list!' })
  }

  readingListEntry.read = req.body.read

  await readingListEntry.save()
  res.status(204).end()
})

module.exports = router