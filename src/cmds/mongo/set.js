'use strict'
const mongo = require('mongoclient')
module.exports = async(obj = {})=>{
  try{
    if(obj.collection, obj.query, obj.payload){
      await mongo.set(obj.collection, obj.query, obj.payload)
      return true
    }
  }catch(e){
    throw(e)
  }
}
