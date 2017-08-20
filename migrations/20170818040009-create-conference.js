'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('conferences', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: Sequelize.STRING,
      accountSid: Sequelize.STRING,
      recordingSid: Sequelize.STRING,
      recordingUrl: Sequelize.STRING,
      recordingStatus: Sequelize.STRING,
      recordingDuration: Sequelize.INTEGER,
      recordingFileSize: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('conferences')
};
