const express = require('express');
const app = express();
const port = 8000;
// mongoose
//   .connect(
//     'mongodb+srv://motasim:motasim@vlog-app.4gvhs.mongodb.net/vlogapp?retryWrites=true&w=majority',
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log("Error in connecting DB", err));
const db = require('./config/mongoose');

app.get('/', (req, res) => {
  res.send("hello world");
});

app.listen(port, function (err) {

  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});