//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// express is required to make a server.

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//static files url will be with respect to public folder not the index.html

app.get("/",function(req,res){
    res.sendFile(__dirname+"/Signup.html")

}) //this helps the server to get the response for display

app.post("/",function(req,res){
    var fname = req.body.fName;
    var lname = req.body.lName;
    var email = req.body.email;
    // var pass = req.body.message;
    
    var data ={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fname,
                LNAME:lname,
            }
        }
        ]
    }
    //data here is converted into object to be sent on mailchimp server

    var jsonData = JSON.stringify(data); //object converted to json object
    const url = "https://us21.api.mailchimp.com/3.0/lists/fac799f2ce" //server location
    const options = {
        method: "POST", //confirming the method type that is post the data.
        auth: "kunal123:6793151081e83a0237ce82f5ccf0f537-us21", //admin name and password.

    }
    const request = https.request(url,options,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/Success.html");
        }else{
            res.sendFile(__dirname + "/Failed.html")
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));    
        })// requesting the data from the mailchimp server
    })

    request.write(jsonData); // sending the data to the mailchimp server
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(3000,function(){
    console.log("server is running at port 3000")
});

//api key 
//6793151081e83a0237ce82f5ccf0f537-us21
//audience Id fac799f2ce
//u can refer here for documentation stuff