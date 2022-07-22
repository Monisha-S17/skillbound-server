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

app.get("/subCategory/:categoryId", (req, res) => {
  // console.log(req.body);

  const categoryId = req.params.categoryId;
  console.log(categoryId);

  // connection.query(
  const sql1 = `SELECT * FROM sub_cat WHERE cat_id = ${categoryId} `;
      //console.log(sql1);

   connection.query(sql1, function (err, results, fields) {
      if (err) {
        console.log(err.message);

      } else {
      //console.log(results);
      res.json(results);
       }
  })
// //  )  
//   res.json({results});
});


app.get('/updatesql', (req, res) => {
  connection.query(
    'select * From `sub_cat` LIMIT 00, 800',
    function (err, results, fields) {
     
     return results.map((e, i) => {
        const s_cat_Id = e.id;
        const  catId = e.cat_id       
        const s_cat_name = e.s_cat_name;
        const sql = `UPDATE skill_wants SET 
                     s_cat_id = ${s_cat_Id} 
                     WHERE s_cat_name = "${s_cat_name}" AND cat_id = ${catId}  `;
        connection.query(sql, function (err, results, fields) {
          console.log(sql);
          if (err) {
            console.log(err.message);
          } else {
            console.log(results);
            //res.json(results);
          }
        }
        )
        
      });
    }
  );
  // res.json({results});
});


// start skill_got table data

//get user skills
app.get("/skills/:userId", (req, res) => {
  const currentUserId = req.params.userId;

  const sql = `SELECT skill_got.id AS skillId, skill_got.user_id AS user_id, skill_got.country AS country,skill_got.cat_id AS cat_id, skill_got.sub_cat_id AS sub_cat_id, skill_got.level1 AS level1, skill_got.level2 AS level2, skill_got.level3 AS level3, categories.cat_name AS cat_name, sub_cat.s_cat_name AS s_cat_name FROM skill_got INNER JOIN categories ON categories.id = skill_got.cat_id INNER JOIN sub_cat ON   sub_cat.id = skill_got.sub_cat_id WHERE skill_got.user_id = ${currentUserId}  
              `;
  
  //console.log(sql);            
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

//Add user skills

app.post('/addSkill',(req,res)=>{
  const user_id = req.body.userId;
  console.log(user_id);
  const cat_id =req.body.categoryId;
  const subCategoryId =req.body.subCategoryId;
  const skillLevel =req.body.skillLevel; 
  const teachLevel = req.body.teachLevel;
  const wishes = req.body.wishes;
    
  const sql =`INSERT INTO skill_got (user_id, cat_id, sub_cat_id, level1, level2,level3) VALUES (${user_id},${cat_id}, ${subCategoryId}, "${skillLevel}","${teachLevel}", "${wishes}" )`;
  connection.query(sql, function (err, results, fields) {
      //console.log(sql);

       if (err) {
            console.log(err.message);
          } else {
           console.log(results);
            res.json("Skill Added Successfully");
          }
        }
        )
});

//update user skills
app.put('/skillUpdate',(req,res)=>{
  const skillId = req.body.skillId;
  console.log("id", skillId);
  const cat_id =req.body.categoryId;
  const selectWishes =req.body.selectWishes;
  const skillLevel =req.body.skillLevel;
  const subCategoryId = req.body.subCategoryId;
  const teachLevel = req.body.teachLevel;
    
  const sql =`UPDATE skill_got SET cat_id=${cat_id}, sub_cat_id= ${subCategoryId}, level1="${skillLevel}", level2="${teachLevel}", level3="${selectWishes}" WHERE id= ${skillId}`;
  connection.query(sql, function (err, results, fields) {
      //console.log(sql);

       if (err) {
            console.log(err.message);
          } else {
           // console.log(results);
            res.json("Updated Successfully");
          }
        }
        )
});

//delete user skills
app.delete('/delete/:skillId', (req, res) => {
  // console.log(req.body);

  const skillId = req.params.skillId;
  console.log(skillId);

  // connection.query(
  const sql1 = `DELETE FROM skill_got WHERE id = ${skillId} `;
      //console.log(sql1);

   connection.query(sql1, function (err, results, fields) {
      if (err) {
        console.log(err.message);

      } else {
      //console.log(results);
     res.json("Skill is deleted");
       }
  })
// //  )  
//   res.json({results});
});


//End user skill_got table data

//Start skill_want table data
app.get("/skills/:userId", (req, res) => {
  const currentUserId = req.params.userId;

  const sql = `SELECT skill_got.id AS skillId, skill_got.user_id AS user_id, skill_got.country AS country,skill_got.cat_id AS cat_id, skill_got.sub_cat_id AS sub_cat_id, skill_got.level1 AS level1, skill_got.level2 AS level2, skill_got.level3 AS level3, categories.cat_name AS cat_name, sub_cat.s_cat_name AS s_cat_name FROM skill_got INNER JOIN categories ON categories.id = skill_got.cat_id INNER JOIN sub_cat ON   sub_cat.id = skill_got.sub_cat_id WHERE skill_got.user_id = ${currentUserId}  
              `;
  
  //console.log(sql);            
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


//End skill_want table data


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

});

app.post('/skills', (req, res) => {
  res.json({ data: "Welcome2" });
});





app.listen('3000', () => {
  console.log("Server started");
});

