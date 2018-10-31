"use strict"

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//Quitar aviso de Mongoose Promise de la consola
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/music-web',{ useNewUrlParser: true },(err,res)=>{
  if(err){
    throw err;
    console.log("PROBLEMAS DE CONEXION DE BASE DE DATOS");
  } else {
    console.log("La conexion a la base de datos esta funcionando ...");
    app.listen(port, function(){
      console.log("Servidor del API REST de musica escuchando en http://localhost:"+port);
    });
  }
});
