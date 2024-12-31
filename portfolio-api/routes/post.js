const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Post, Liked, User } = require('../models')
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

try {
   fs.readdirSync('uploads')
} catch (err) {
   console.log('uploads 폴더가 없습니다. 폴더를 생성합니다.')
   fs.mkdirSync('uploads')
}

const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/')
      },
      filename(req, file, cb) {
         const decodedFileName = decodeURIComponent(file.originalname)
         const ext = path.extname(decodedFileName)
         const basename = path.basename(decodedFileName, ext)

         cb(null, basename + Date.now() + ext)
      },
   }),
   limits: { fileSize: 10 * 1024 * 1024 },
})

// 등록
router.post('/', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      const post = await Post.create({
         title: req.body.title,
         comment: req.body.comment, // 게시물 내용
         img: req.file ? `/${req.file.filename}` : null, // 이미지 url
         projectUrl: req.body.projectUrl,
         UserId: req.user.id, // 작성자 id
      })
      res.json({
         success: true,
         post: {
            id: post.id,
            title: post.title,
            comment: post.comment,
            img: post.img,
            projectUrl: post.projectUrl,
            UserId: post.UserId,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 등록 실패',
         error: err,
      })
   }
})

// 수정
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      // 게시물 존재 여부 확인
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }

      await post.update({
         title: req.body.title,
         comment: req.body.comment,

         img: req.file ? `/${req.file.filename}` : post.img, // 수정된 이미지 파일이 있으면 교체 없으면 기존
         projectUrl: req.body.projectUrl,
      })
      // 업데이트 후 게시물 조회
      const updatedPost = await Post.findOne({
         where: { id: req.params.id },
         // users와 hashtags 테이블의 컬럼 값을 포함해서 가져옴
         include: [
            {
               model: User,
               attributes: ['id', 'nick'], // id, nick 값만 가져옴
            },
         ],
      })
      res.json({
         success: true,
         post: updatedPost,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 수정 실패',
         error: err,
      })
   }
})

// 삭제
router.delete('/:id', isLoggedIn, async (req, res) => {
   try {
      // 삭제 게시물 존재 여부 확인
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }

      // 게시물 삭제
      await post.destroy()
      res.json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 삭제 실패',
         error: err,
      })
   }
})

// 게시물 조회
router.get('/:id', async (req, res) => {
   try {
      const post = await Post.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'nick', 'email'],
            },
         ],
      })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }
      res.json({
         success: true,
         post: post,
         message: '게시물 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 조회 실패',
         error: err,
      })
   }
})

// 전체 게시물 불러오기(페이징 기능)
router.get('/', async (req, res) => {
   try {
      // parseInt('08') > 일부 브라우저에서 NaN 반환
      // parseInt('08',10) > 10진수 8을 반환
      const page = parseInt(req.query.page, 10) || 1 // page 번호 기본값 = 1
      const limit = parseInt(req.query.limit, 10) || 6 // 한 페이지 당 나타낼 객체 갯수
      const offset = (page - 1) * limit

      // 게시물의 전체 개수
      // select count(*) from posts
      const count = await Post.count()

      // 게시물 레코드 가져오기
      /*
      page:1, limit: 3 일 경우 offset: 0
      select * from posts order by createAt desc limit 3 offset 0

      page:2, limit: 3 일 경우 offset: 3
      select * from posts order by createAt desc limit 3 offset 3

      page:3, limit: 3 일 경우 offset: 6
      select * from posts order by createAt desc limit 3 offset 6
      offset - 건너뛰기
      */
      const posts = await Post.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], // createdAt (기본) : 최신 날짜 순으로 가져온다
         // 게시글을 작성한 사람과 게시글에 작성된 해시태그를 같이 가져온다
         include: [
            {
               model: User,
               attributes: ['id', 'nick', 'email'],
            },
         ],
      })

      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '전체 게시물 리스트 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 조회 실패',
         error: err,
      })
   }
})

// 특정 유저 게시물 전체 불러오기
router.get('/user/:id', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 6
      const offset = (page - 1) * limit

      const count = await Post.count({
         where: { UserId: req.params.id },
      })

      const posts = await Post.findAll({
         where: { UserId: req.params.id },
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: User,
               attributes: ['id', 'nick', 'email'],
            },
         ],
      })

      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '특정 유저 게시물 리스트 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 조회 실패',
         error: err,
      })
   }
})

// 관심글 게시물 전체 불로오기
router.get('/liked/:id', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 6
      const offset = (page - 1) * limit

      const count = await Liked.count({
         where: { UserId: req.params.id },
      })

      const posts = await Liked.findAll({
         where: { UserId: req.params.id },
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: Post,
               include: [
                  {
                     model: User,
                     attributes: ['id', 'nick', 'email'],
                  },
               ],
            },
         ],
      })

      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '관심 게시물 리스트 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '관심 게시물 조회 실패',
         error: err,
      })
   }
})

module.exports = router
