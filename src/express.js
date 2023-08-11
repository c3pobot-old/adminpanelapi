'use strict'
const log = require('logger')
const express = require('express')
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL
const BOT_OWNER_ID = process.env.BOT_OWNER_ID
const PORT = process.env.PORT || 3000

const Cmds = require('./cmds')
const { DecryptId } = require('./helpers')

let imgProxy
if(S3_PUBLIC_URL) imgProxy = createProxyMiddleware({
  target: S3_PUBLIC_URL,
  secure: false
})
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())
if(imgProxy){
  app.use('/asset', imgProxy)
  app.use('/portrait', imgProxy)
  app.use('/thumbnail', imgProxy)
}
app.use(express.static(path.join(__dirname, 'webapp')));

app.get('/healthz', (req, res)=>{
  res.json({status: 'health check success'}).status(200)
})

app.post('/api', (req, res)=>{
  handleRequest(req, res)
})
app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
})
const server = app.listen(PORT, ()=>{
  log.info(`adminpanelapi is listening on ${server.address().port}`)
})
const handleRequest = async(req, res)=>{
  try{
    let data, response = { message: 'No method provided' }, status = 400
    if(req?.body?.data) data = req.body.data
    let discordId = await DecryptId(req?.body?.dId)
    if(discordId !== BOT_OWNER_ID && req?.body?.method !== 'discordAuth'){
      res.status(400).json({message: 'only bot owner allowed'})
      return
    }
    if(req.body?.method){
      response = {message: 'Unknown Comand : '+req.body.method}
      if(Cmds[req?.body?.method]){
        status = 200
        response = await Cmds[req.body.method](data, discordId)
      }
    }
    res.status(status).json(response)
  }catch(e){
    log.error(e)
    res.sendStatus(400)
  }
}
