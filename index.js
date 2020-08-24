const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/user');
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


app.get('/', (req, res) => {
  res.send("hello world");
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
      data: userData
    });
  });

})


app.listen(port, function (err) {

  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});