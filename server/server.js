const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const fileUpload = require('express-fileupload');
const multer  = require('multer');
const { uuid } = require('uuidv4');
const  path = require('path');
const { query } = require("express");


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
app.use(express.static('puplic'))
app.use(cors(config));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());


//get user details
// app.get("/userDetails/:userId", (req, res) => {
//   connection.query(
//     "SELECT * FROM `skill_users` WHERE id=394",
//     function (err, results, fields) {
//       res.json(results);
//     }
//   );
//   // res.json({results});
// });

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
  const categoryId = req.params.categoryId;
  const sql = `SELECT * FROM sub_cat WHERE cat_id = ${categoryId} `;
  connection.query(sql, function (err, results, fields) {
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

//get country list data
app.get("/country/", (req,res) =>{
  connection.query(
    "SELECT * FROM `geo_countries` ORDER BY `name` ASC",
    function (err, results, fields) {
      
      res.json(results);
    }
  )
});

//get state list
app.get("/state/:countryNameId", (req, res)=>{
  const countryId = req.params.countryNameId;
  const sql = `SELECT * FROM geo_states WHERE geo_states.con_id = ${countryId}`;
  connection.query(sql, function(err, results, fields){
    if(err){
      console.log(err);
    }else{
      res.json(results)
    }
  })

});

//get city list
app.get("/city/:stateNameId", (req, res) => {
   const stateId = req.params.stateNameId;
   const sql = `SELECT * FROM geo_cities WHERE geo_cities.sta_id = ${stateId}`;
   connection.query(sql, function(err, results,fields){
    if(err){
      console.log(err);
    }else{
      res.json(results);
    }
   }) 
})

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
  console.log('post');
  const user_id = req.body.userId;
  const cat_id = req.body.categoryId;
  const subCategoryId = req.body.subCategoryId;
  const skillLevel = req.body.skillLevel;
  const teachLevel = req.body.teachLevel;
  const wishes = req.body.wishes;
  const countryId = req.body.countryId;

  const sql = `INSERT INTO skill_got (user_id, cat_id, level1, level2,level3, country, s_cat_id) VALUES (${user_id}, ${cat_id}, "${skillLevel}", "${teachLevel}", "${wishes}", ${countryId}, '${subCategoryId}' )`;
  console.log(sql);
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

  const sql = `SELECT skill_wants.id AS skillId, skill_wants.user_id AS user_id, skill_wants.country AS country,skill_wants.cat_id AS cat_id, skill_wants.s_cat_id AS s_cat_id, skill_wants.level AS wishesTo, categories.cat_name AS cat_name, sub_cat.s_cat_name AS s_cat_name FROM skill_wants LEFT JOIN categories ON categories.id = skill_wants.cat_id LEFT JOIN sub_cat ON sub_cat.id = skill_wants.s_cat_id WHERE skill_wants.user_id = ${currentUserId}
             `;
  //

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

  const sql = `UPDATE skill_wants SET cat_id=${cat_id}, s_cat_id= "${subCategoryId}",  level="${selectWishes}" WHERE id= ${skillId}`;
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

  const sql = `INSERT INTO skill_wants (user_id, cat_id, level, country, s_cat_id ) VALUES (${user_id},${cat_id}, "${wishes}", ${countryId}, '${subCategoryId}' )`;
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
  const sql = `DELETE FROM skill_wants WHERE id = ${wantSkillId} `;
  //console.log(sql1);

  connection.query(sql, function (err, results, fields) {
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

// var Storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//   var pathname = req.file.originalname;
//   console.log(pathname);
//   var path = pathname[0].replace('_','/');
//   console.log(path);
//   cb(null,'./upload'+pathname);
//   },
//   filename: function(req, file, callback) {
//   var pathname = file.originalname;
//   var filename = pathname[1];
//   if(pathname!=undefined)
//   callback(null, pathname);
//   }
//   });

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, './upload')
  },
  filename: (req,file, cb)=>{
    cb(null,Date.now() + path.extname(file.originalname))

  }
})
  const upload = multer({ storage: storage });


// add skill sale data
// app.post("/addSaleSkill",multer({dest:'./upload/'}).single('file'),  (req, res) => {
//   console.log(req.body);
//   const user_id = req.body.userId;
//   const className = req.body.className;
//   const skillName = req.body.skillName;  
//   const currency = req.body.currency;
//   const payment = req.body.payment;
//   const videoFile = req.body.file;
//   const serviceOffer = req.body.serviceOffer;  
//   console.log(videoFile);
//   const sql = `INSERT INTO  onlineclass_reg (user_id, classname, conductedby, currency,payment, videotutorial,skills) VALUES (${user_id},"${className}", "${serviceOffer}", "${currency}", "${payment}","${videoFile}","${skillName}" )`;
//   console.log(sql);
//   connection.query(sql, function (err, results, fields) {
//     if (err) {
//       console.log(err.message);
//     } else {
//       // console.log(results);
//       res.json("Want Skill Added Successfully");
//     }
//   });
// });

app.post("/addSaleSkill",(req,res)=>{
  var fileName;
  let uploadStatus = false;
  let uploadUrl;  
  if(req.files){      
    var file = req.files.file;
    fileName = file.name;
    file.mv('./upload/video/'+fileName,function(err){
      if (err){          
          //res.send(err);          
      }else{
        uploadStatus = true;
        //res.send("file Uploaded")
      }

    })
  
  } 
    
  const user_id = req.body.userId;
  const className = req.body.className;
  const skillName = req.body.skillName;  
  const currency = req.body.currency;
  const payment = req.body.payment;
  const videoFile = fileName;
  const serviceOffer = req.body.serviceOffer; 
  

    const sql = `INSERT INTO  onlineclass_reg (user_id, classname, conductedby, currency,payment, videotutorial,skills) VALUES (${user_id},"${className}", "${serviceOffer}", "${currency}", "${payment}","${videoFile}","${skillName}" )`;
    connection.query(sql, function (err, results ,fields) {
      if (err) {
        console.log(err.message);
      } else {
        res.json("Want Skill Added Successfully");
      }
     } );
  
});

//End Sale skill

//start user details
app.get('/userdetails/:userId', (req, res)=>{
  const currentUserId = req.params.userId;

  const sql = `SELECT users.active_account AS activeDetails, users.address AS Address, users.bod AS bod, users.borough AS borough, users.business AS business, users.company AS company, users.emailid AS emailId, users.fname AS firstName, users.gender AS gender, users.id AS userId, users.lname AS lastName, users.password AS password, users.phone AS phone, users.rates AS rates, users.regtime AS regtime, users.school AS school, users.town AS town, users.username AS userName, users.village AS village, users.work AS work, users.zip AS zip,users.licenses AS licenses,users.experiences AS experiences,users.qualifications AS qualifications, users.country AS countryId , users.state AS stateId, users.city AS cityId , country.name AS countryName, states.name AS statesName, cities.name AS citiesName FROM skill_users AS users LEFT JOIN geo_countries AS country ON country.con_id = users.country LEFT JOIN geo_states AS states ON states.sta_id = users.state LEFT JOIN geo_cities AS cities ON cities.cty_id = users.city  WHERE users.id =  ${currentUserId}  
  `;
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {

      res.json(results);

    }
  });
});

app.put('/updateUserDetails',(req, res)=>{
  const userId = req.body.userId;
  const cityId = req.body.cityId;
  const countryId = req.body.countryId;
  const stateId = req.body.stateId;
  const companyName = req.body.companyName;
  const experience = req.body.experience;
  const gender = req.body.gender;
  const licenses = req.body.licenses;
  const password = req.body.password;
  const qualifications = req.body.qualifications;
  const rates = req.body.rates;
  const schoolName = req.body.schoolName;
  const work = req.body.work;



  const sql = `UPDATE skill_users SET password ='${password}', gender='${gender}', work='${work}',company='${companyName}', qualifications='${qualifications}', school='${schoolName}', licenses='${licenses}',experiences='${experience}', rates='${rates}', city=${cityId}, state=${stateId}, country=${countryId} WHERE id=${userId}`;

  connection.query(sql, function(err, results, fields){
    if(err){
      console.log(err.msg);
    }else{
      res.json('user details updated');
    }
  })
});


//get user friend list

app.get('/friends/:userId', (req, res)=>{
  const currentUserId = req.params.userId;

  const sql = `SELECT a.id, b.username, b.work, b.gender  FROM invite AS a RIGHT JOIN skill_users AS b ON a.email = b.id WHERE a.user_Id = ${currentUserId} AND a.accept ="yes" AND a.m_block = '0'`;
  connection.query(sql, function(err, results, fields){
    if (err) {
      console.log(err.message);
    } else {

      res.json(results);

    }
  })
});

//unfried request

app.delete('/unfriend/:id', (req, res)=>{
  const friendId = req.params.id;
  // console.log(friendId);
  const sql = `DELETE FROM invite WHERE id = ${friendId}`;
  // console.log(sql);
  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(results);
      res.json("Removed this user in friend list");
    }
  });
  
});

//block the user
app.put('/userBlock',(req, res)=>{
  const friendId = req.body.id;
  const blocked = req.body.blocknumber;

  const sql = `UPDATE  invite SET m_block =${blocked} WHERE id=${friendId}`;

  connection.query(sql, function(err, results, fields){
    if(err){
      console.log(err.msg);
    }else{
      res.json('blocked the user');
    }
  })
});

//Unblock the user
app.put('/unBlock',(req, res)=>{
  const friendId = req.body.requestId;
  const blocked = req.body.block;

  const sql = `UPDATE  invite SET m_block =${blocked} WHERE id=${friendId}`;

  connection.query(sql, function(err, results, fields){
    if(err){
      console.log(err.msg);
    }else{
      res.json('blocked the user');
    }
  })
});


//friend request accept


app.put('/requestAccept',(req, res)=>{
  const requestId = req.body.id;
  const accept = req.body.accept;

  const sql = `UPDATE invite SET accept ='${accept}' WHERE id=${requestId}`;

  connection.query(sql, function(err, results, fields){
    if(err){
      console.log(err.msg);
    }else{
      res.json('Accept the user');
    }
  })
});

// get friend request list
app.get('/friendRequest/:userId', (req, res) => {
  const currentUserId = req.params.userId;

  const sql =`SELECT b.username, b.work, b.gender, a.id AS requestId  FROM invite AS a RIGHT JOIN skill_users AS b ON a.email = b.id WHERE a.user_Id = ${currentUserId} AND a.accept ="no"`
  connection.query(sql, function(err, results, fields){
    if (err) {
      console.log(err.message);
    } else {
      res.json(results);

    }
  })

});

//get userName list
app.get('/userNamelist',(req,res) =>{

  const sql =  `SELECT username FROM skill_users`;
  connection.query(sql, function(err, result, fields){
    if(err){
      console.log(err.message);
    } else{

      res.json(result);
    }
  })
});

//get specific user

app.get('/user/:user',(req,res) =>{
 const user = req.params.user;
 

  const sql = `SELECT * FROM skill_users WHERE skill_users.username LIKE "%${user}%" `;
  connection.query(sql, function(err, result, fields){
    if(err){
      console.log(err);
    }else{
      res.json(result);
    }
  })
});


//get user blocked list
app.get('/blockedList/:userId', (req, res)=>{
  const userId = req.params.userId;

  const sql =`SELECT b.username, b.work, b.gender, a.id AS requestId  FROM invite AS a RIGHT JOIN skill_users AS b ON a.email = b.id WHERE a.user_Id = ${userId} AND a.m_block ="1"`;

  connection.query(sql, function(err, result, fields){
    if(err){
      console.log(err);
    }else{
      res.json(result);
    }
  })
})




app.post("/skills", (req, res) => {
  res.json({ data: "Welcome2" });
});



app.listen("3000", () => {
  console.log("Server started");
});
