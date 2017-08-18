module.exports = (sequelize, DataTypes) => (
  sequelize.define('conference', {
    name: DataTypes.STRING,
    accountSid: DataTypes.STRING,
    conferenceSid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    recordingSid: DataTypes.STRING,
    recordingUrl: DataTypes.STRING,
    recordingStatus: DataTypes.STRING,
    recordingDuration: DataTypes.INTEGER,
    recordingFileSize: DataTypes.INTEGER,
  })
);
