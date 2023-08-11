'use strict'
const log = require('logger')
const fetch = require('node-fetch')
const parseResponse = async(res)=>{
  try{
    if(res?.status?.toString().startsWith(4)) throw('Fetch Error')
    if(!res?.status?.toString().startsWith('2')) return
    let body
    if(res.headers?.get('Content-Type')?.includes('application/json')) body = await res.json()
    if(res.headers?.get('Content-Type')?.includes('text/plain')) body = await res.text()
    if(res.headers?.get('Content-Disposition')?.includes('filename')){
      body = await res.arrayBuffer()
      body = Buffer.from(body)
    }
    return body
  }catch(e){
    throw(e)
  }
}
module.exports = async(uri, opts = {})=>{
  try{
    let res = await fetch(uri, opts)
    return await parseResponse(res)
  }catch(e){
    log.error(e)
    if(e?.name) return { error: e.name, message: e.message }
    if(e?.status) return await parseResponse(e)
    throw(e)
  }
}
