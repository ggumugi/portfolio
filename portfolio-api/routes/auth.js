const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const User = require('../models/user')

// uploads 폴더가 없을 경우 새로 생성
try {
   fs.readdirSync('userUploads')
} catch (err) {
   console.log('userUploads 폴더가 없습니다. 폴더를 생성합니다.')
   fs.mkdirSync('userUploads')
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'userUploads/')
      },
      filename(req, file, cb) {
         const decodedFileName = decodeURIComponent(file.originalname) //파일명 디코딩(한글 파일명 깨짐 방지)
         const ext = path.extname(decodedFileName) //확장자 추출
         const basename = path.basename(decodedFileName, ext) //확장자 제거한 파일명 추출

         // 파일명 설정: 기존이름 + 업로드 날짜시간 + 확장자
         // dog.jpg
         // ex) dog + 1231342432443 + .jpg
         cb(null, basename + Date.now() + ext)
      },
   }),
   // 파일의 크기 제한
   limits: { fileSize: 10 * 1024 * 1024 }, // 5MB로 제한
})

// 회원가입 localhost:8000/auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
   /*
    {
    email: 'test@example.com',
    ncik:'아무개'
    password: '123456'
    }
    */
   const { email, nick, password } = req.body

   try {
      const exUser = await User.findOne({ where: { email } })
      if (exUser) {
         // 이미 사용자가 존재할 경우 409 상태코드와 메시지를 json 객체로 응답하면서 함수 종료
         return res.status(409).json({
            success: false,
            message: '이미 존재하는 사용자입니다.',
         })
      }
      // 이메일 중복 확인 통과시 새로운 사용자 계정 생성
      const hash = await bcrypt.hash(password, 12) // 12 : salt(해시 암호화를 진행시 추가되는 임의의 데이터로 10~12 정도의 값이 권장)
      const newUser = await User.create({
         email,
         nick,
         password: hash,
      })
      // 성공 시 201 상태 코드와 json 객체로 응답
      res.status(201).json({
         success: true,
         message: '회원가입 성공!',
         user: {
            id: newUser.id,
            email: newUser.email,
            nick: newUser.nick,
            img: newUser.img,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '회원가입 중 오류가 발생했습니다.',
         error: err,
      })
   }
})

// 로그인 localhost:8000/auth/login
router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      if (authError) {
         // 로그인 인증 중 에러
         return res.status(500).json({
            success: false,
            message: '인증 중 오류 발생',
            error: authError,
         })
      }
      if (!user) {
         // 비밀번호 불일치 또는 사용자가 없을 경우 info.message를 사용해서 메시지 전달
         return res.status(401).json({
            success: false,
            message: info.message || '로그인 실패',
         })
      }

      // 인증이 정상적으로 작동하고 사용자를 로그인 상태로 변경함
      req.login(user, (loginError) => {
         if (loginError) {
            return res.status(500).json({ success: false, message: '로그인 중 오류 발생', error: loginError })
         }
         // 로그인 성공 시 user 객체와 함께 response
         res.json({
            success: true,
            message: '로그인 성공!',
            user: {
               id: user.id,
               nick: user.nick,
               img: user.img,
               email: user.email,
            },
         })
      })
   })(req, res, next)
})

// 로그아웃 localhost:8000/auth/logout
router.get('/logout', isLoggedIn, async (req, res, next) => {
   // 사용자를 로그아웃 상태로 만듬
   req.logout((err) => {
      if (err) {
         console.log(err)
         return res.status(500).json({
            success: false,
            message: '로그아웃 중 오류가 발생했습니다.',
            error: err,
         })
      }

      res.json({
         success: true,
         message: '로그아웃에 성공했습니다.',
      })
   })
})

// 사용자 정보 변경
router.patch('/update', isLoggedIn, upload.single('img'), async (req, res, next) => {
   const { nick, password } = req.body
   const userId = req.user.id
   try {
      if (!req.file && !password && !nick) {
         // 업로드된 파일이 없거나 이상이 있어 파일 정보가 넘어오지 않는 경우
         return res.status(400).json({
            success: false,
            message: '파일이 존재하지 않거나 이상합니다.',
         })
      }

      const user = await User.findOne({ where: { id: userId } })

      if (!user) {
         return res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.',
         })
      }

      // 닉네임이 변경되었을 경우 처리
      if (nick && nick !== user.nick) {
         user.nick = nick
      }

      // 비밀번호가 변경되었을 경우, 비밀번호를 해시하여 업데이트
      if (password) {
         const hashedPassword = await bcrypt.hash(password, 12)
         user.password = hashedPassword
      }

      // 이미지가 변경되었을 경우 처리
      if (req.file) {
         user.img = `/${req.file.filename}`
      }

      // 변경된 내용을 저장
      await user.save()

      // 성공적으로 업데이트되었을 경우 응답
      res.json({
         success: true,
         message: '회원 정보가 성공적으로 업데이트되었습니다.',
         user: {
            id: user.id,
            email: user.email,
            nick: user.nick,
            img: user.img,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '회원 정보 업데이트 중 오류가 발생했습니다.',
         error: err,
      })
   }
})

// 로그인 상태 확인 localhost:8000/auth/status
router.get('/status', async (req, res, next) => {
   if (req.isAuthenticated()) {
      // req.user 는 passport의 역직렬화 설정에 의해 로그인 시 사용자 정보를 가져올 수 있다
      res.json({
         isAuthenticated: true,
         user: {
            id: req.user.id,
            nick: req.user.nick,
            email: req.user.email,
            img: req.user.img,
         },
      })
   } else {
      res.json({
         isAuthenticated: false,
      })
   }
})

module.exports = router
