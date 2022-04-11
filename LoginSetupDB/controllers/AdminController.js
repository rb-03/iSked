const { response } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const { append } = require('express/lib/response')
// app.set('view engine', 'jade').
const bodyParser = require('body-parser');
const express = require('express')
const { handle } = require('express/lib/application')
const { header } = require('express/lib/request')
const { any } = require('../middleware/upload')


const app = express();
// support parsing of application/json type post data
app.use(bodyParser.json())

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended:true}))




// Show list of Employees //ADMIN
const index = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured'
        })
    })
}
//{email:{$regex:email}}
// Show single employee //ADMIN
const show = (req, res, next) => {
    let email = req.body.email
    User.find({email:{$regex:email}},{username:1,password:1,avatar:1})
        .then(response => {
            console.log(typeof response);
            const password = response[0].password;//.email; //.response.email;
            const username = response[0].username;//.email; //.response.email;
            const avatar = response[0].avatar;//.email; //.response.email;
            res.render('../views/index.pug', {email: email, username: username, password: password, avatar: avatar});
    
    })
        
        .catch(error => {
            res.json({
                message: error.message
            })   
        })
};
        






//add new employee //ADMIN
const store = (req,res, next) => {
    email = session.email
    let updatedData = {
        avatar : req.body.avatar,
        password: String
    }
    //password = req.body.password
    if(req.files) {
        let path = ''
        req.files.forEach(function(files, index,arr){
            path = path + files.path + ','
        })
        path = path.substring(0,path.lastIndexOf(","))
        updatedData.avatar = path
        session.avatar = path;
    }
    enterpass = req.body.password
    console.log("The entered password is "+enterpass)
    //password = req.body.password
    //console.log(password)
    if(enterpass)
     {
        var hashedPass
        bcrypt.hash(enterpass, 10, function(err, hashedPass){
            if(err) {
                res.json({
                    error: err
                })
            }
            console.log("The hashed password is"+hashedPass)
            
            updatedData.password = hashedPass
         User.findOneAndUpdate({email:{$regex:email}}, {$set: updatedData})     
         .then(() => {
             console.log(updatedData)
             res.json({  
                 message: 'User updated successfully!'
             })
         }).catch(error => {
             res.json({
                 message: 'An error occured'
             })
         })
        })
    }        
}


 
//ADD PROFILE PICTURE FUNCTION USER
// const profile = (req,res, next) => {
    // let email = req.body.email
    // let password = req.body.password
   
//     if(req.files) {
//         let path = ''
//         req.files.forEach(function(files, index,arr){
//             path = path + files.path + ','
//         })
//         path = path.substring(0,path.lastIndexOf(","))
//         employee.avatar = path
//     }
//     let updatedData = {
        
//     }
    
//     .then(response => {
//         res.json({
//             message: 'Employee added successfully'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'An error occured'
//         })
//     })
// }

// const uploa = (req,res,next)


//update an employee //USER AND ADMIN
const update = (req, res, next) => {
    let email = req.body.email
    //let avatar = req.body.avatar

    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err) {
            res.json({
                error: err
            })
        }
        let updatedData = {
           // avatar: req.body.avatar,
            //email: req.body.email,
            password: hashedPass
        }
        console.log(typeof avatar)
        User.findOneAndUpdate({email:{$regex:email}}, {$set: updatedData})
        
        .then(() => {
        res.json({   
            message: 'USer updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
    })
         
}


//delete an employee //ADMIN
const destroy = (req,res,next) => {
    let email = req.body.email
    User.findByIdAndRemove(email)
    .then(() => {
        res.json({
            message: 'Employee Deleted Successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error occured'
        })
    })
}

module.exports = {
    index,show,store,update,destroy
}