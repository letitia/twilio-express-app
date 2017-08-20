module.exports = (sequelize, DataTypes) => (
  sequelize.define('call', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    callerName: DataTypes.STRING,
    conferenceSid: DataTypes.STRING,
    accountSid: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    from: DataTypes.STRING,
    fromFormatted: DataTypes.STRING,
    forwardedFrom: DataTypes.STRING,
    to: DataTypes.STRING,
    toFormatted: DataTypes.STRING,
    answeredBy: DataTypes.STRING,
    status: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE
  })
);
