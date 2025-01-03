const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const { Noti, Post, User } = require('../models')

// 알림 등록
router.post('/:id', isLoggedIn, async (req, res) => {
   try {
      // 게시글 정보 가져오기
      const post = await Post.findOne({
         where: { id: req.params.id },
         include: { model: User, attributes: ['id'] }, // 게시글 작성자 정보
      })

      if (!post) {
         return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' })
      }

      const takeUser = post.User.id // 게시글 작성자 (알림 수신자)

      // 알림 생성
      const newNoti = await Noti.create({
         message: `${req.user.nick}님이 게시글에 좋아요를 눌렀습니다.`, // 알림 메시지
         isRead: false, // 읽음 여부 초기값
         sendUser: req.user.id, // 알림 발신자
         takeUser, // 알림 수신자 (게시글 작성자)
         PostId: req.params.id, // 게시글 ID
      })

      res.json({
         success: true,
         noti: {
            message: newNoti.message,
            sendUser: newNoti.sendUser,
            takeUser: newNoti.takeUser,
            PostId: newNoti.PostId,
            isRead: newNoti.isRead,
         },
         message: '알림 등록 성공',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '알림 등록 실패',
         error: err.message,
      })
   }
})

// 알림 읽음 처리
router.put('/:id', isLoggedIn, async (req, res) => {
   try {
      const noti = await Noti.findOne({
         where: {
            id: req.params.id,
         },
      })

      if (!noti) {
         return res.status(404).json({ success: false, message: '해당 알림이 존재하지 않습니다.' })
      }

      // 알림의 isRead를 true로 업데이트
      await noti.update({ isRead: true })

      res.json({
         success: true,
         message: '알림 읽음 처리 성공',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '알림 읽음 처리 실패',
         error: err.message,
      })
   }
})

// 알림 확인
router.get('/', isLoggedIn, async (req, res) => {
   try {
      const noti = await Noti.findAll({
         where: {
            takeUser: req.user.id, // 알림 수신자
         },
      })

      res.json({
         success: true,
         notifications: noti,
         message: '알림 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '알림 확인 실패',
         error: err.message,
      })
   }
})

module.exports = router
