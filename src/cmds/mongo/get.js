'use strict'
const mongo = require('mongoclient')
module.exports = async(obj = {})=>{
  try{
    if(obj.collection) return await mongo.find(obj.collection, obj.query || {}, obj.projection || null)
  }catch(e){
    throw(e)
  }
}
