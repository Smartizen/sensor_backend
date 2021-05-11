const generateUUID = () => {
  let uuid = '';
  const cs = '!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 18; i++) {
    uuid += cs.charAt(Math.floor(Math.random() * cs.length));
  }
  return uuid;
};

module.exports = generateUUID;
