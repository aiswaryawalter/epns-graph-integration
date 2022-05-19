import { 
  BigInt,
  Bytes, 
  ipfs,
  json,
  JSONValueKind,
  log } from "@graphprotocol/graph-ts"
import { NumberChanged } from '../generated/Storage/Storage'
import { Storage, Epnspushgraph } from '../generated/schema'

const CHANNEL_ADDRESS = '0x9dFe790B3baBCBD888dA7093017a0B7A68b99937'

export function handleNumberChanged(event: NumberChanged): void {
  let id = event.transaction.hash.toHexString()
  // let id = event.block.timestamp.toHex()
  log.info('New id of Storage is: {}', [id])
  let storage = Storage.load(id)
  if (storage == null) {
    storage = new Storage(id)
  }
  storage.from = event.params.from
  storage.to = event.params.to
  storage.save()
  let recipient = "0xD8634C39BBFd4033c0d3289C4515275102423681",
    cta = "https://epns.io/",
    img = "null",
    msg = `Number changed from ${event.params.from} to ${event.params.to}`,
    sub = "Number changed",
    type = "3",
    secret = "null",
    title = "Number changed",
    body = `Number changed from ${event.params.from} to ${event.params.to}`,
    timestamp = event.block.timestamp
  sendEPNSNotificication(
    recipient, 
    cta, 
    img, 
    msg, 
    sub, 
    type, 
    secret, 
    title, 
    body, 
    timestamp
  )
}

function sendEPNSNotificication(
  recipient: string, 
  cta: string, 
  img: string, 
  msg: string, 
  sub: string, 
  type: string, 
  secret: string, 
  title: string, 
  body: string, 
  timestamp: BigInt
): void {
  let id = timestamp.toHexString()
  log.info('New id of Epnspushgraph is: {}', [id])
  let notification = Epnspushgraph.load(id)
  if (notification == null) {
    notification = new Epnspushgraph(id)
    notification.count = BigInt.fromI32(0)
  }
  notification.count = (notification.count).plus(BigInt.fromI32(1))
  notification.recipient = recipient
  notification.asub = sub
  notification.amsg = msg
  notification.type = type
  notification.acta = cta
  notification.aimg = img
  notification.secret = secret
  notification.title = title
  notification.body = body
  notification.save()
}


