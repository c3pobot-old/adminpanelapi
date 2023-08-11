'use strict'
const redis = require('redisclient')
module.exports = async(obj = {})=>{
  try{
    if(obj.key) return await redis.get(obj.key)
  }catch(e){
    throw(e)
  }
}
