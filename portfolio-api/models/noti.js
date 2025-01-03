const Sequelize = require('sequelize')

module.exports = class Noti extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            message: {
               type: Sequelize.STRING(255), // 알림 메시지
               allowNull: false,
            },
            isRead: {
               type: Sequelize.BOOLEAN, // 읽음 여부
               defaultValue: false,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Noti',
            tableName: 'notis',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.Noti.belongsTo(db.User, {
         foreignKey: 'takeUser',
         as: 'Receiver',
      })
      db.Noti.belongsTo(db.User, {
         foreignKey: 'sendUser',
         as: 'Sender',
      })
      db.Noti.belongsTo(db.Post)
   }
}
