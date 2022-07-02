const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'skillbound',
});


const app = express();
const config = {
  origin: 'http://localhost:4200'
};
app.use(express.json());
app.use(cors(config));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/userDetails', (req, res) => {
  connection.query(
    'select * From`skill_users` where id="394"',
    function (err, results, fields) {
      res.json(results);
    }
  );
  // res.json({results});
});

app.get("/skills/:userId", (req, res) => {
  const currentUserId = req.params.userId;
  const sql = `SELECT 
               *          
               FROM skill_got WHERE               
               user_id = ${currentUserId}
              `;
  // console.log(sql);            
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      // console.log(results);
      res.json(results);
    }
  }
  )
});

// get category data
app.get('/category/', (req, res) => {
  connection.query(
    'SELECT * FROM `categories` ORDER BY `cat_name` ASC',
    function (err, results, fields) {
      res.json(results);
    }
  );
  // res.json({results});
});


app.post("/subCategory", (req, res) => {
  // console.log(req.body);

  const selectCategoryName = req.body.category.toLowerCase();
  console.log(selectCategoryName);

  // connection.query(
  const sql1 = `SELECT * FROM sub_cat WHERE LOWER(cat_name) = '${selectCategoryName}' `;
   connection.query(sql1, function (err, results, fields) {
      if (err) {
        console.log(err.message);

      } else {
      console.log(results);
        res.json(results);
       }
  })
// //  )  
//   res.json({results});
});


app.post('/signup', (req, res) => {
  const request = {
    username: req.body.lastname,
    fname: req.body.firstname,
    lname: req.body.lastname,
    password: req.body.lastname,
    emailid: req.body.firstname
  }
  connection.query(
    'INSERT INTO `skill_users` SET ? ', request,
    function (err, results, fields) {
      if (err) {
        res.json(err);
      } else {
        res.json({ message: "Successfully Registered." });
      }
    }
  );

})

app.post('/skills', (req, res) => {
  res.json({ data: "Welcome2" });
})

app.listen('3000', () => {
  console.log("Server started");
});

