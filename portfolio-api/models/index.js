const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]

const User = require('./user')
const Post = require('./post')
const Liked = require('./liked')

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.User = User
db.Post = Post
db.Liked = Liked

User.init(sequelize)
Post.init(sequelize)
Liked.init(sequelize)

User.associate(db)
Post.associate(db)
Liked.associate(db)

module.exports = db