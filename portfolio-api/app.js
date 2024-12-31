const express = require('express')
const path = require('path') // 경로 처리 유틸리티
const cookieParser = require('cookie-parser') // 쿠키 처리 미들웨어
const morgan = require('morgan') // HTTP 요청 로깅 미들웨어
const session = require('express-session') // 세션 관리 미들웨어
const passport = require('passport') // 인증 미들웨어 여권 느낌
require('dotenv').config() // 환경 변수 관리
const cors = require('cors') // cors 미들웨어 -> api 서버는 반드시 설정해줘야 한다

// 라우터 밑 기타모듈 불러오기
const indexRouter = require('./routes')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const pageRouter = require('./routes/page')
const likedRouter = require('./routes/liked')
const { sequelize } = require('./models')
const passportConfig = require('./passport') // passport 폴더의 index.js

const app = express()
passportConfig() //passport 실행
app.set('port', process.env.PORT || 8002)

sequelize
   .sync({ force: false })
   .then(() => {
      console.log('데이터베이스 연결 성공')
   })
   .catch((err) => {
      console.error(err)
   })
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true,
   })
)

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use('/userUploads', express.static(path.join(__dirname, 'userUploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET)) // 쿠키 설정

app.use(
   session({
      resave: false, // 세션 데이터 변경이 없어도 재저장 여부 -> false = 변경 사항이 있으면 재저장
      saveUninitialized: true, // 초기화 되지 않은 세션 저장 여부 -> 초기화 되지 않은 빈 세션도 저장
      secret: process.env.COOKIE_SECRET, // 세션 암호화 키 설정
      cookie: {
         httpOnly: true, // javascript로 쿠키에 접근 가능한지 여부 => true 일 경우 접근 x
         secure: false, // https를 사용할때만 쿠키 전송 여부 => false 일 경우 http, https 둘다 사용 가능
      },
   })
)

// Passport 초기화, 세션 연동
app.use(passport.initialize()) // 초기화
app.use(passport.session()) // Passport와 생성해둔 세션 연결
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/page', pageRouter)
app.use('/liked', likedRouter)

app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
   error.status = 404
   next(error)
})

app.use((err, req, res, next) => {
   const statusCode = err.status || 500
   const errorMessage = err.message || '서버 내부 오류'

   console.log(err)

   res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: err,
   })
})

app.options('*', cors())
app.listen(app.get('port'), () => {
   console.log(app.get('port'), '번 포트에서 대기중')
})
