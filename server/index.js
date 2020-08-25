const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/user');
const { auth } = require('./middleware/auth');
const db = require('./config/mongoose');

// mongoose
//   .connect(
//     'mongodb+srv://motasim:motasim@vlog-app.4gvhs.mongodb.net/vlogapp?retryWrites=true&w=majority',
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log("Error in connecting DB", err));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  })
})

app.get('/', (req, res) => {
  res.send("hello world");
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
      userData: doc
    });
  });
});

app.post('/api/users/login', (req, res) => {
  //find the email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found"
      });
    }
    //compare password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "Wrong password" })
      }
    });

    //generateToken
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true
        })
    })

  })
})


app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    });
  })
})

app.listen(port, function (err) {

  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});