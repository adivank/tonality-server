

/**
 * Database connection
 */
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    city: String,
    street: {
      name: String,
      number: Number
    }
  },
  age: String
})

const User = mongoose.model('User', userSchema);

const userZero = new User({
  username: 'blabla',
  password: 'Zf1!257RTa',
  address: {
    city: 'London',
    street: {
      name: 'General',
      number: 21
    }
  },
  age: 28
})

userZero.save().then(
  () => console.log("One entry added"),
  (err) => console.log(err)
)

app.get('/', (req, res) => {
  User.find({}, (err, found) => {
      if (!err) {
          res.send(found);
      } else {
        console.log(err);
        res.send("Some error occured!")
      }
  }).catch(err => console.log("Error occured, " + err));
});