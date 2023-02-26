require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const mongoose = require('mongoose');
const session = require('express-session');
const env = process.env;
const routers = require("./routes")

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// セッション情報
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1800000},
}));

//mongoDBとの接続
mongoose.connect(env.MONGO_DB_URI)
.then(() => {
  console.log('Success: Connected to MongoDB');
})
.catch((error) => {
  console.error("Failure: Unconnected to MongoDB");
})

app.use(routers)

//404エラー対応
app.get("*", (req, res) => {
  res.render("error", { message: "ページが存在しません"});
});

//ポートの設定
const port = process.env.PORT || 5001;

app.listen(5001, () => {
  console.log(`Listening on ${port}` );
  console.log(env.MONGO_DB_URI);
});
