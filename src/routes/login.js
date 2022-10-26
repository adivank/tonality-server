const User = require('../schemas/user-shema');
const jwt = require('jsonwebtoken');

const generateUserLink = require('../helpers/base-helpers').generateUserLink;

module.exports = async (req, res) => {
  const {username, password} = req.body;
  User.findOne({username}, (err, found) => {
    if (!err) {
      if(found && found.password === password) {
        const token = jwt.sign({name: found.username}, process.env.API_KEY, { expiresIn: "1h" });

        return res.cookie("auth._token.cookie", token, {
          httpOnly: true
        }).send({
          username: found.username,
          name: found.name,
          surname: found.surname,
          pageLink: generateUserLink(found.username)
        });
      } else {
        const error = {
          errorDescription: 'Wrong Username or Password',
          errorClass: 'toast-error',
        };
        res.send({ error });
      };
    } else {
      console.log(err);
      res.send("Some error occured!")
    }
  }).catch(err => console.log("Error occured, " + err));
}