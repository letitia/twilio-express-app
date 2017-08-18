'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('conferences', {
      name: Sequelize.STRING,
      accountSid: Sequelize.STRING,
      conferenceSid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
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
