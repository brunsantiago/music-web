'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// function getArtist(req, res){
//   res.status(200).send({message:'Metodo getArtist del cotrolador artist.js'});
// }

function saveArtist(req, res){
  var artist = new Artist();

  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored)=>{
    if(err){
      res.status(500).send({message:'Error al guardar el Artista'});
    }else{
      if(!artistStored){
        res.status(404).send({message:'No se pudo guardar el Artista'});
      }else{
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

function getArtist(req, res){

  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist)=>{

    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!artist){
        res.status(404).send({message:'El Artista no existe'});
      }else{
        res.status(200).send({artist});
      }
    }
  });
}

function getArtists(req, res){

  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }

  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!artists){
        res.status(404).send({message:'No hay Artistas'});
      }else{
        return res.status(200).send({
          total_items: total,
          artists: artists
        });
      }
    }
  });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists
};
