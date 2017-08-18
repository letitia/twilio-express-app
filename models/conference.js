module.exports = (sequelize, DataTypes) => (
  sequelize.define('conference', {
    name: DataTypes.STRING,
    account_sid: DataTypes.STRING,
    conference_sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    recording_sid: DataTypes.STRING,
    recording_url: DataTypes.STRING,
    recording_status: DataTypes.STRING,
    recording_duration: DataTypes.INTEGER,
    recording_file_size: DataTypes.INTEGER,
  })
);
