module.exports = (sequelize, DataTypes) => (
  sequelize.define('conference', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    accountSid: DataTypes.STRING,
    status: DataTypes.STRING,
    recordingSid: DataTypes.STRING,
    recordingUrl: DataTypes.STRING,
    recordingStatus: DataTypes.STRING,
    recordingDuration: DataTypes.INTEGER,
    recordingFileSize: DataTypes.INTEGER
  })
);
