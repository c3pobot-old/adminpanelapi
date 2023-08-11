'use strict'
const fetch = require('./fetch')
const path = require('path')
const AE_URI = process.env.AE_URI
const swgohClient = require('swgohClient')

const FetchImage = async(iconKey, version)=>{
  try{
    if(!AE_URI || !iconKey || !version) return
    let assest = iconKey?.replace('tex.', '')
    let uri = 'Asset/single?forceReDownload=true&version='+version+'&assetName='+assest
    let res = await fetch(path.join(AE_URI, uri))
    if(res) return res.toString('base64')
  }catch(e){
    throw(e);
  }
}
module.exports = async(obj = {})=>{
  try{
    if(!obj.iconKey) return
    let metaData = await swgohClient('metadata', {})
    if(!metaData?.assetVersion) return
    return await FetchImage(obj.iconKey, metaData.assetVersion)
  }catch(e){
    throw(e)
  }
}
