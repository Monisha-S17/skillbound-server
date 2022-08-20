const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const fileUpload = require('express-fileupload');


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "skillbound",
});

const app = express();
const config = {
  origin: "http://localhost:4200",
};
app.use(express.json());
app.use(cors(config));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());


//get user details
app.get("/userDetails/:userId", (req, res) => {
  connection.query(
    "SELECT * FROM `skill_users` WHERE id=394",
    function (err, results, fields) {
      res.json(results);
    }
  );
  // res.json({results});
});

app.post("/dashboard", (req, res) => {
  // console.log(req);

  const emailId = req.body.email;
  const password = req.body.password;


  // connection.query(
  const sql = `SELECT * FROM skill_users WHERE emailid = "${emailId}" AND password = "${password}"`;
  // console.log(sql);

  connection.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(results);
      res.json(result);
    }
  });
  // //  )
  //   res.json({results});
});

// get category data
app.get("/category/", (req, res) => {
  connection.query(
    "SELECT * FROM `categories` ORDER BY `cat_name` ASC",
    function (err, results, fields) {
      res.json(results);
    }
  );
  // res.json({results});
});

app.get("/subCategory/:categoryId", (req, res) => {
  // console.log(req.body);

  const categoryId = req.params.categoryId;

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
  });
  // //  )
  //   res.json({results});
});

// category id  insert in skill_got table
app.get("/skillCatIdUpdate", (req, res) => {
  connection.query(
    "select * From `categories` LIMIT 00, 800",
    function (err, results, fields) {
      return results.map((e, i) => {
        const catId = e.id;
        const cat_name = e.cat_name;
        const sql = `UPDATE skill_got SET 
                     cat_id = ${catId} 
                     WHERE category = "${cat_name}" `;
        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            console.log(results);
            //res.json(results);
          }
        });
      });
    }
  );
  // res.json({results});
});

// sub category id  insert in skill_got table

app.get("/skillSubCatIdUpdate", (req, res) => {
  connection.query(
    "select * From `sub_cat` LIMIT 00, 800",
    function (err, results, fields) {
      return results.map((e, i) => {
        const s_cat_id = e.id;
        const catId = e.cat_id;
        const s_cat_name = e.s_cat_name;
        const sql = `UPDATE skill_got SET 
                     s_cat_id = ${s_cat_id} 
                     WHERE s_cat_name = "${s_cat_name}" AND cat_id = ${catId}  `;
        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            console.log(results);
            //res.json(results);
          }
        });
      });
    }
  );
  // res.json({results});
});

// category id  insert in skill_wants table

app.get("/wantSkillCatIdUpdate", (req, res) => {
  connection.query(
    "select * From `categories` LIMIT 00, 800",
    function (err, results, fields) {
      return results.map((e, i) => {
        const catId = e.id;
        const cat_name = e.cat_name;
        const sql = `UPDATE skill_wants SET 
                     cat_id = ${catId} 
                     WHERE category = "${cat_name}" `;
        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            console.log(results);
            //res.json(results);
          }
        });
      });
    }
  );
  // res.json({results});
});

// Sub category id  insert in skill_wants table

app.get("/wantSkillSubCatIdUpdate", (req, res) => {
  connection.query(
    "select * From `sub_cat` LIMIT 00, 800",
    function (err, results, fields) {
      return results.map((e, i) => {
        const s_cat_id = e.id;
        const catId = e.cat_id;
        const s_cat_name = e.s_cat_name;
        const sql = `UPDATE skill_wants SET 
                     s_cat_id = ${s_cat_id} 
                     WHERE s_cat_name = "${s_cat_name}" AND cat_id = ${catId}  `;
        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err.message);
          } else {
            console.log(results);
            //res.json(results);
          }
        });
      });
    }
  );
  // res.json({results});
});

// start skill_got table data

//get user skills
app.get("/skills/:userId", (req, res) => {
  const currentUserId = req.params.userId;

  const sql = `SELECT skill_got.id AS skillId, skill_got.user_id AS user_id, skill_got.country AS country,skill_got.cat_id AS cat_id, skill_got.s_cat_id AS s_cat_id, skill_got.level1 AS level1, skill_got.level2 AS level2, skill_got.level3 AS level3, categories.cat_name AS cat_name, sub_cat.s_cat_name AS s_cat_name FROM skill_got LEFT JOIN categories ON categories.id = skill_got.cat_id LEFT JOIN sub_cat ON   sub_cat.id = skill_got.s_cat_id WHERE skill_got.user_id = ${currentUserId} 
              `;

  //console.log(sql);
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(results);
      res.json(results);
    }
  });
});

//Add user skills

app.post("/addSkill", (req, res) => {
  const user_id = req.body.userId;
  const cat_id = req.body.categoryId;
  const subCategoryId = req.body.subCategoryId;
  const skillLevel = req.body.skillLevel;
  const teachLevel = req.body.teachLevel;
  const wishes = req.body.wishes;
  const countryId = req.body.countryId;

  const sql = `INSERT INTO skill_got (user_id, cat_id, s_cat_id, level1, level2,level3, country) VALUES (${user_id},${cat_id}, "${subCategoryId}", "${skillLevel}","${teachLevel}", "${wishes}", ${countryId} )`;
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results);
      res.json("Skill Added Successfully");
    }
  });
});

//update user skills
app.put("/skillUpdate", (req, res) => {
  const skillId = req.body.skillId;
  const cat_id = req.body.categoryId;
  const selectWishes = req.body.selectWishes;
  const skillLevel = req.body.skillLevel;
  const subCategoryId = req.body.subCategoryId;
  const teachLevel = req.body.teachLevel;

  const sql = `UPDATE skill_got SET cat_id=${cat_id}, s_cat_id= ${subCategoryId}, level1="${skillLevel}", level2="${teachLevel}", level3="${selectWishes}" WHERE id= ${skillId}`;
  connection.query(sql, function (err, results, fields) {
    //console.log(sql);

    if (err) {
      console.log(err.message);
    } else {
      // console.log(results);
      res.json("Updated Successfully");
    }
  });
});

//delete user skills
app.delete("/delete/:skillId", (req, res) => {
  // console.log(req.body);

  const skillId = req.params.skillId;

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
  });
  // //  )
  //   res.json({results});
});

//End user skill_got table data

//Start skill_want table data
app.get("/wantSkill/:userId", (req, res) => {
  const currentUserId = req.params.userId;

  const sql = `SELECT skill_wants.id AS skillId, skill_wants.user_id AS user_id, skill_wants.country AS country,skill_wants.cat_id AS cat_id, skill_wants.s_cat_id AS s_cat_id, skill_wants.level AS wishesTo, categories.cat_name AS cat_name, sub_cat.s_cat_name AS s_cat_name FROM skill_wants LEFT JOIN categories ON categories.id = skill_wants.cat_id LEFT JOIN sub_cat ON   sub_cat.id = skill_wants.s_cat_id WHERE skill_wants.user_id = ${currentUserId}
             `;
  //

  //console.log(sql);
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      res.json(results);
    }
  });
});

//End skill_want table data

app.post("/signup", (req, res) => {
  const request = {
    username: req.body.lastname,
    fname: req.body.firstname,
    lname: req.body.lastname,
    password: req.body.lastname,
    emailid: req.body.firstname,
  };
  connection.query(
    "INSERT INTO `skill_users` SET ? ",
    request,
    function (err, results, fields) {
      if (err) {
        res.json(err);
      } else {
        res.json({ message: "Successfully Registered." });
      }
    }
  );
});

//update user want skills
app.put("/wantSkillUpdate", (req, res) => {
  const skillId = req.body.wantSkillId;
  const cat_id = req.body.categoryId;
  const selectWishes = req.body.selectWishes; 
  const subCategoryId = req.body.subCategoryId;

  const sql = `UPDATE skill_wants SET cat_id=${cat_id}, s_cat_id= ${subCategoryId},  level="${selectWishes}" WHERE id= ${skillId}`;
  connection.query(sql, function (err, results, fields) {

    if (err) {
      console.log(err.message);
    } else {
      // console.log(results);
      res.json("Updated Successfully");
    }
  });
});

//Add user want skills

app.post("/addWantSkill", (req, res) => {
  const user_id = req.body.userId;
  const cat_id = req.body.categoryId;
  const subCategoryId = req.body.subCategoryId;  
  const wishes = req.body.wishes;
  const countryId = req.body.countryId;
  //console.log(countryId);

  const sql = `INSERT INTO skill_wants (user_id, cat_id, s_cat_id, level, country) VALUES (${user_id},${cat_id}, "${subCategoryId}", "${wishes}", ${countryId} )`;
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      res.json("Want Skill Added Successfully");
    }
  });
});

//Delete want skill data
app.delete("/WantSkilldelete/:wantSkillId", (req, res) => {

  const wantSkillId = req.params.wantSkillId;

  // connection.query(
  const sql1 = `DELETE FROM skill_wants WHERE id = ${wantSkillId} `;
  //console.log(sql1);

  connection.query(sql1, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(results);
      res.json("Skill is deleted");
    }
  });
  // //  )
  //   res.json({results});
});


//get skill sale data
app.get("/getSkillSale/:userId", (req, res) => {
  const currentUserId = req.params.userId;

  const sql = `SELECT * FROM onlineclass_reg WHERE onlineclass_reg.user_id = ${currentUserId} 
              `;

  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      // console.log(results);
      res.json(results);
    }
  });
});

// add skill sale data
app.post("/addSaleSkill", (req, res) => {
  const user_id = req.body.userId;
  const className = req.body.className;
  const skillName = req.body.skillName;  
  const currency = req.body.currency;
  const payment = req.body.payment;
  const videoFile = req.body.videoFile;
  const serviceOffer = req.body.serviceOffer;  

  const sql = `INSERT INTO  onlineclass_reg (user_id, classname	, conductedby, currency,payment, videotutorial,skills) VALUES (${user_id},"${className}", "${serviceOffer}", "${currency}", "${payment}","${videoFile}","${skillName}" )`;
  console.log(sql);
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      // console.log(results);
      res.json("Want Skill Added Successfully");
    }
  });
});

// app.post('/addSaleSkill', function(req, res) {
//   let sampleFile;
//   let uploadPath;
//   console.log(req.body.videoFile);

//   // if (!req.files || Object.keys(req.files).length === 0) {
//   //   return res.status(400).send('No files were uploaded.');
//   // }

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   sampleFile = req.body.videoFile;
//   uploadPath = __dirname + '/upload/' + sampleFile;
//   console.log(uploadPath);
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv(uploadPath, function(err) {
//     if (err)
//       return res.status(500).send(err);

//     res.send('File uploaded!');
//   });
// });



app.post("/skills", (req, res) => {
  res.json({ data: "Welcome2" });
});

//file upload



app.listen("3000", () => {
  console.log("Server started");
});
