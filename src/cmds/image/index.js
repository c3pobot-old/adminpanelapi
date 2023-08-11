'use strict'
const Cmds = {}
Cmds.save = require('./save')
Cmds.get = require('./get')
module.exports = async(obj = {})=>{
  try{
    if(obj.cmd && Cmds[obj.cmd]) return await Cmds[obj.cmd](obj)
  }catch(e){
    throw(e);
  }
}
