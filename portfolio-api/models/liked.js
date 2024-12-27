const Sequelize = require('sequelize')

module.exports = class Liked extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {},
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Liked',
            tableName: 'likeds',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.Liked.belongsTo(db.User)
      db.Liked.belongsTo(db.Post)
   }
}
