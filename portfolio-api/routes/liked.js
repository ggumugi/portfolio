const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const { Liked } = require('../models')

// 좋아요 등록
router.post('/:id/add', isLoggedIn, async (req, res) => {
   try {
      const existingLiked = await Liked.findOne({
         where: {
            UserId: req.user.id,
            PostId: req.params.id,
         },
      })
      if (existingLiked) {
         return res.status(400).json({ success: false, message: '이미 좋아요를 누른 게시물입니다.' })
      }
      const liked = await Liked.create({
         UserId: req.user.id,
         PostId: req.params.id,
      })
      res.json({
         success: true,
         liked: {
            UserId: liked.UserId,
            PostId: liked.PostId,
         },
         message: '좋아요 성공',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '좋아요 등록 실패',
         error: err,
      })
   }
})

// 좋아요 삭제
router.delete('/:id/sub', isLoggedIn, async (req, res) => {
   try {
      // 해당 포스트에 대한 좋아요가 있는지 확인
      const liked = await Liked.findOne({
         where: {
            UserId: req.user.id,
            PostId: req.params.id,
         },
      })

      if (!liked) {
         return res.status(404).json({ success: false, message: '좋아요 상태가 아닙니다.' })
      }

      // 좋아요 삭제
      await liked.destroy()

      res.json({
         success: true,
         message: '좋아요 삭제 성공',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '좋아요 삭제 실패',
         error: err,
      })
   }
})
// 좋아요 확인
router.get('/:id/check', isLoggedIn, async (req, res) => {
   try {
      const liked = await Liked.findOne({
         where: {
            UserId: req.user.id,
            PostId: req.params.id,
         },
      })

      if (liked) {
         return res.json({ success: true, message: '관심글 입니다.' })
      } else {
         return res.json({ success: false, message: '관심글이 아닙니다.' })
      }
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '좋아요 여부 확인 실패',
         error: err,
      })
   }
})
module.exports = router
