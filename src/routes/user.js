const User = require('../schemas/user-shema');

exports.getUser = async (req, res) => {
  const { username } = req.body;
  await User.findOne({username}, (err, found) => {
    if(found) {
      return res.send({
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
  })
}