
const db = require('../data/login.json');

module.exports = async (req, res) => {
  const {username, password} = req.body;

  const userIndex = db.results.users.findIndex(user => user.login.username === username);
  const user = db.results.users[userIndex];
  
  if(user) {
    if(user.login.password !== password) {
      return res.status(403).send('Access denied!');
    }
  } else {
    return res.status(404).send('User not found');
  }

  const token = jwt.sign(user, 'hello', { expiresIn: "1h" });

  return res.cookie("auth._token.cookie", token, {
    httpOnly: true
  }).send({user});
}