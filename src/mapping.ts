import { 
  BigInt,
  Bytes, 
  ipfs,
  json,
  JSONValueKind,
  log } from "@graphprotocol/graph-ts"
import { NumberChanged } from '../generated/Storage/Storage'
import { Storage, EpnsNotificationCounter, EpnsPushNotification } from '../generated/schema'

const subgraphID = "aiswaryawalter/graph-poc-sample"

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
  type = "3",
  title = "Number changed",
  body = `Number changed from ${event.params.from} to ${event.params.to}`,
  subject = "Number changed",
  message = `Number changed from ${event.params.from} to ${event.params.to}`,
  image = "https://play-lh.googleusercontent.com/i911_wMmFilaAAOTLvlQJZMXoxBF34BMSzRmascHezvurtslYUgOHamxgEnMXTklsF-S",
  secret = "null",
  cta = "https://epns.io/",

  notification = `{\"type\": \"${type}\", \"title\": \"${title}\", \"body\": \"${body}\", \"subject\": \"${subject}\", \"message\": \"${message}\", \"image\": \"${image}\", \"secret\": \"${secret}\", \"cta\": \"${cta}\"}`
 
  sendEPNSNotification(
  recipient, 
   notification
  )
}

function sendEPNSNotification(recipient: string, notification: string): void 
{
  let id1 = subgraphID
  log.info('New id of EpnsNotificationCounter is: {}', [id1])
  let epnsNotificationCounter = EpnsNotificationCounter.load(id1)
  if (epnsNotificationCounter == null) {
    epnsNotificationCounter = new EpnsNotificationCounter(id1)
    epnsNotificationCounter.totalCount = BigInt.fromI32(0)
  }
  epnsNotificationCounter.totalCount = (epnsNotificationCounter.totalCount).plus(BigInt.fromI32(1))

  let count = epnsNotificationCounter.totalCount.toHexString()
  let id2 = `${subgraphID}+${count}`
  log.info('New id of EpnsPushNotification is: {}', [id2])
  let epnsPushNotification = EpnsPushNotification.load(id2)
  if (epnsPushNotification == null) {
    epnsPushNotification = new EpnsPushNotification(id2)
  }
  epnsPushNotification.recipient = recipient
  epnsPushNotification.notification = notification
  epnsPushNotification.notificationNumber = epnsNotificationCounter.totalCount
  epnsPushNotification.save()
  epnsNotificationCounter.save()
}


