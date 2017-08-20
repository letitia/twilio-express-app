'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('calls', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      callerName: Sequelize.STRING,
      conferenceSid: Sequelize.STRING,
      accountSid: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      from: Sequelize.STRING,
      fromFormatted: Sequelize.STRING,
      forwardedFrom: Sequelize.STRING,
      to: Sequelize.STRING,
      toFormatted: Sequelize.STRING,
      answeredBy: Sequelize.STRING,
      status: Sequelize.STRING,
      startTime: Sequelize.DATE,
      endTime: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    })
  ,

  down: (queryInterface, Sequelize) => queryInterface.dropTable('calls')
};
