'use strict'
const Cmds = {}
Cmds.get = require('./get')
Cmds.set = require('./set')
module.exports = async(obj = {})=>{
  try{
    if(obj.method && Cmds[obj.method]) return await Cmds[obj.method](obj)
  }catch(e){
    throw(e)
  }
}
