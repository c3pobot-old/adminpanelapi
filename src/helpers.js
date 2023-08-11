'use strict'
const CryptoJS = require('crypto-js')
const Cmds = {}
Cmds.EncryptId = (discordId)=>{
  if(!discordId) return
  return (CryptoJS.AES.encrypt(discordId, process.env.DISCORD_CLIENT_SECRET)).toString()
}
Cmds.DecryptId = (encrypted_id)=>{
  if(!encrypted_id) return
  return (CryptoJS.AES.decrypt(encrypted_id, process.env.DISCORD_CLIENT_SECRET)).toString(CryptoJS.enc.Utf8)
}
module.exports = Cmds
