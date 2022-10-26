const User = require('../schemas/user-shema');
const jwt = require('jsonwebtoken');

const generateUserLink = require('../helpers/base-helpers').generateUserLink;

module.exports = async (req, res) => {
  const {information, login, userId} = req.body;
  const pageLink = generateUserLink(login.email);
  const userCreateData = {
    information,
    login,
    userId,
    pageLink
  }
  const tokenOptions = {
    httpOnly: true
  }

  try {
    await User.findOne({ 'login.email': login['email'] }, async (err, found) => {
      if(!found) {
        await User.create(userCreateData)
        .then(newUser => {
          const { information, login, userId } = newUser;
          const { email, username } = login;
          const token = jwt.sign({name: information.name}, 'hello', { expiresIn: "1h" });

          return res.cookie("auth._token.cookie", token, tokenOptions)
            .send({
              information,
              email,
              username,
              pageLink,
              userId
            });
        });
      } else {
        const error = {
          errorDescription: 'Email already in use',
          errorClass: 'toast-error',
        };
        res.send({ error });
      }
    });
  } catch(error) {
    console.error(error);
  }
}