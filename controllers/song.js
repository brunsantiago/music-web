'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// function getSong(req, res){
//   res.status(200).send({message:'Metodo getArtist del cotrolador song.js'});
// }

function saveSong(req, res){
  var song = new Song();
  var params = req.body;

  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored)=>{
    if(err){
      res.status(500).send({message:'Error al guardar la Cancion'});
    }else{
      if(!songStored){
        res.status(404).send({message:'No se pudo guardar el Cancion'});
      }else{
        res.status(200).send({song: songStored});
      }
    }
  });
}

function getSong(req, res){

  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{

    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!song){
        res.status(404).send({message:'El Album no existe'});
      }else{
        res.status(200).send({song});
      }
    }
  });
}

function getSongs(req, res){

  var albumId = req.params.artist;

  if (!albumId){
    //Sacar todos las Canciones de la BBDD
    var find = Song.find({}).sort('name');
  }else{
    //Sacar los Canciones de un Album concreto de la BBDD
    var find = Song.find({album: albumId}).sort('number');
  }

  find.populate({
                path: 'album',
                populate:{
                  path: 'artist',
                  model: 'Artist'
                }
              }).exec((err,songs)=>{
    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!songs){
        res.status(404).send({message:'No hay canciones'});
      }else{
        res.status(200).send({songs});
      }
    }
  });
}

function updateSong(req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!songUpdated){
        res.status(404).send({message:'El Album no existe'});
      }else{
        res.status(200).send({song: songUpdated});
      }
    }
  });
}

function deleteSong(req, res){

  var songId = req.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved)=> {
    if(err){
      res.status(500).send({message:'Error al eliminar la Cancion'});
    }else{
      if(!songRemoved){
        res.status(404).send({message:'No se pudo eliminar la Cancion'});
      }else{
        res.status(200).send({album: songRemoved});
      }
    }
  });
}

function uploadFile(req,res){
  var songId = req.params.id;
  var file_name = 'No subido ...';

  if(req.files){
    var file_path = req.files.file.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'mp3' || file_ext == 'ogg'){

      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated)=>{
        if(!songUpdated){
          res.status(404).send({message: 'No se ha podido actualizar la Cancion'});
        }else{
          res.status(200).send({song: songUpdated});
        }
      });
    }else{
      res.status(200).send({message: 'Extension de archivo incorrecta'});
    }
  }else{
    res.status(200).send({message: 'No has subido ninguna cancion...'});
  }
}

function getSongFile(req, res){
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/'+songFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe el fichero de audio...'});
    }
  });
}

// function uploadImage(req,res){
//   var albumId = req.params.id;
//   var file_name = 'No subido ...';
//
//   if(req.files){
//     var file_path = req.files.image.path;
//     var file_split = file_path.split('\\');
//     var file_name = file_split[2];
//
//     var ext_split = file_name.split('\.');
//     var file_ext = ext_split[1];
//
//     if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
//
//       Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{
//         if(!albumUpdated){
//           res.status(404).send({message: 'No se ha podido actualizar el Album'});
//         }else{
//           res.status(200).send({album: albumUpdated});
//         }
//       });
//     }else{
//       res.status(200).send({message: 'Extension de archivo incorrecta'});
//     }
//   }else{
//     res.status(200).send({message: 'No has subido ninguna imagen...'});
//   }
// }
//
// function getImageFile(req, res){
//   var imageFile = req.params.imageFile;
//   var path_file = './uploads/albums/'+imageFile;
//
//   fs.exists(path_file, function(exists){
//     if(exists){
//       res.sendFile(path.resolve(path_file));
//     }else{
//       res.status(200).send({message: 'No existe la imagen...'});
//     }
//   });
// }


module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
  // uploadImage,
  // getImageFile
};
