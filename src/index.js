import Telegraf from 'telegraf'
import express from 'express'
import http from 'http'
import cmc, { btcUp } from './cmc'
import rp from 'request-promise'
import { getResponseToMsg, getColl, learnMsg, msgToEmotion } from './ia'
import util from 'util'

const VERSION = require('../package.json').version
const { GIF_KEY = '6WAhWTpyYpj1KZE10LPlX3G6nvizflcL ', USE_IA = false } = process.env

// DISCLAIMER
// THE CODE OF THIS BOT IS ABSOLUTLY DOG SHIT
// I'M NOT INTERESTED IN MAKING IT CLEAN, YOU THINK I HAVE THE TIME ? lol nop

const expressApp = express()
const port = process.env.PORT || 3000
const { TG_ROOM = '-1001320428552' } = process.env // default to test room

expressApp.get('/', (req, res) => {
	res.send('Hello World!')
})

expressApp.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

const bot = new Telegraf(process.env.BOT_TOKEN)
const randBool = () => Math.random() >= 0.5
const mock = text =>
	[...text]
		.map(l => (randBool() ? l.toLowerCase() : l.toUpperCase()))
		.reduce((a, b) => `${a}${b}`, '')

const dumbies = [
	'https://imgur.com/kEylCE1',
	'https://i.imgur.com/USnkQYL.png',
	'https://imgur.com/3muAzdh',
	'https://i.imgur.com/tk3dgbi.png',
	'https://imgur.com/Gh7UmDl',
	'https://imgur.com/q7ZWksb',
	'https://imgur.com/tR1BtX7',
	'https://i.imgur.com/x91kAkM.png',
	'https://imgur.com/YRXudlD',
	'https://imgur.com/iAXkgN0',
	'https://i.imgur.com/ojPRquk.png',
	'https://imgur.com/K29pMnu',
	'https://imgur.com/KZ2t6dc',
	'https://imgur.com/bCOUq64',
	'https://imgur.com/qEsauQ8',
	'https://imgur.com/sFAJxTy'
]

const gpalu = [
	'https://imgur.com/oQGMl7A',
	'https://i.imgur.com/BVXX0xK.png',
	'https://i.imgur.com/dVpKh0I.png',
	'https://i.imgur.com/OTa3jKT.png',
	'https://i.imgur.com/FbbhWOG.png',
	'https://i.imgur.com/P461Ka8.png',
	'https://i.imgur.com/Khl6Xe1.png',
	'https://i.imgur.com/fkXspCd.png',
	'https://i.imgur.com/79SLEU7.png',
	'https://i.imgur.com/3IpAXkX.png',
	'https://i.imgur.com/weMe546.png',
	'https://i.imgur.com/snKr9OI.png',
	'https://i.imgur.com/nkubYHu.png'
]

const randDumb = () => dumbies[Math.floor(Math.random() * dumbies.length)]
const randGpalu = () => gpalu[Math.floor(Math.random() * gpalu.length)]

bot.hears('mock', ctx => {
	const msg = ctx.update?.message
	const text = msg?.text
	const reply = msg?.reply_to_message?.text
	if (!reply) return
	ctx.replyWithPhoto(randDumb())
	ctx.reply(mock(reply))
})
	
bot.hears('infos', ctx => {
	ctx.reply(util.inspect(ctx.from, false, null, false))
})

// bot.hears('test', console.log)

bot.hears('gpalu', ctx => ctx.replyWithPhoto(randGpalu()))

const replied = new Map()

const sometimeReplyTo = bot => trigger => couldown => respond =>
	bot.hears(trigger, ctx => {
		if (`${ctx.chat.id}` !== TG_ROOM) return
		const last = replied.get(trigger) || 0
		if (randBool() && Date.now() > last + 1000 * 60 * couldown) {
			respond(ctx)
			replied.set(trigger, Date.now())
		}
	})

const pRep = sometimeReplyTo(bot)

const fdpRep = [
	'oh tu croi t ki pr parler comme ca ?',
	'mais mdr parle mieux jvai te lever',
	'ftg tu parle a ki',
	'oh lui jvai vrmt le lever',
	'jsai pa t ki mais reste trkl'
]

const btcRep = [
	'tg sale pauvre',
	'clochar',
	'c mort soon 1k',
	'mdr..',
	'okok..',
	'en fait non',
	'ouloulou pk tu continue de parler ?',
	'dump it',
	'BOGDANOV LAUNCH THE KOREA FUD',
	'dump it again',
	'wooooooooooooosh personne tecoute fils',
	'xD allez ca suffit ya ecole demain raconte pas des conneries stp'
]

const marginRep = [
	'le margin c vrmt pour les singe',
	'jpense que t fait pr etre pauvre',
	'ouai ouai',
	'mec t t encore un putin de sperma je tradai deja',
	'ouai de ouf! non tg',
	'awai ? g pa lu',
	'ok.',
	'uiui si tu veu tkt pas ca va aller'
]

const stpRep = [
	'tema ce mandiant mdr',
	'wsh demerde toi non ?',
	'jpp de toi..',
	'suce au lieu de faire la manche comme ca',
	'clochar',
	't le gitan dla room ?',
	'mdr encore toi ?'
]

const kenRep = [
	'tu baise rien du tout',
	't puceau et tu parle',
	'tlm sait ke t pd',
	'en vrai on sen branle',
	'meme un chameau de dubai ken plus que toi',
	'micro teub',
	't pd',
	'allez ferme la baltringue',
	"jpense vrmt ta un complexe d'inferioriter",
	'ptite pucelle tu baise walou',
	'ta bsoin de prouver qqchose ?',
	'mdr grolar tu ment encore et encore'
]

const risitas = [
	'http://image.noelshack.com/fichiers/2016/24/1466366209-risitas24.png',
	'http://image.noelshack.com/fichiers/2016/24/1466366197-risitas10.png',
	'http://image.noelshack.com/fichiers/2018/27/4/1530827992-jesusreup.png',
	'http://image.noelshack.com/fichiers/2018/10/1/1520256134-risitasue2.png',
	'http://image.noelshack.com/fichiers/2016/38/1474488555-jesus24.png',
	'http://image.noelshack.com/fichiers/2019/24/1/1560120190-reeves.png',
	'http://image.noelshack.com/fichiers/2019/24/1/1560174897-cricri.png',
	'http://image.noelshack.com/fichiers/2016/24/1465900224-risitas6.png',
	'http://image.noelshack.com/fichiers/2016/48/1480464150-1474490285-risitas511.png',
	'http://image.noelshack.com/fichiers/2017/06/1486530718-supiot4.png',
	'http://image.noelshack.com/fichiers/2017/25/4/1498091525-1481201791-risitasneutronexplosion.jpg',
	'http://image.noelshack.com/fichiers/2016/32/1470667606-risitas.png',
	'http://image.noelshack.com/fichiers/2016/31/1470146887-1468144810-1466366215-risitas33.png',
	'http://image.noelshack.com/fichiers/2016/30/1469541963-risitas217.png',
	'http://image.noelshack.com/fichiers/2016/32/1470667101-risitas.png',
	'http://image.noelshack.com/fichiers/2016/31/1470146909-1465679708-risitas.png',
	'http://image.noelshack.com/fichiers/2016/41/1476439037-1470667268-risitas290.png',
	'http://image.noelshack.com/fichiers/2016/32/1470666745-risitas289.png',
	'http://image.noelshack.com/fichiers/2016/32/1470672987-risitas.png',
	'http://image.noelshack.com/fichiers/2017/01/1483553699-1466366606-risitas97.png',
	'http://image.noelshack.com/fichiers/2016/32/1470668607-risitas291.png',
	'http://image.noelshack.com/fichiers/2017/38/4/1505947545-jesus-dofus-bouftou-rire.png',
	'http://image.noelshack.com/fichiers/2018/47/4/1542914224-jesus-koulosse-2.png',
	'http://image.noelshack.com/fichiers/2017/29/7/1500835740-2kaliptus.png',
	'http://image.noelshack.com/fichiers/2017/38/4/1505950387-risitas-sueur.png',
	'http://image.noelshack.com/fichiers/2017/30/4/1501185683-jesusjournalbestreup.png',
	'http://image.noelshack.com/fichiers/2017/19/1494343590-risitas2vz-z-3x.png',
	'http://image.noelshack.com/fichiers/2016/47/1479995469-risitas-hero.png',
	'http://image.noelshack.com/fichiers/2018/34/2/1534813362-bogdanoff2.png',
	'http://image.noelshack.com/fichiers/2018/04/7/1517106679-carlos-bitconneeee.png'
]

const randFdp = () => fdpRep[Math.floor(Math.random() * fdpRep.length)]
const randMargin = () => marginRep[Math.floor(Math.random() * marginRep.length)]
const randStp = () => stpRep[Math.floor(Math.random() * stpRep.length)]
const randRis = () => risitas[Math.floor(Math.random() * risitas.length)]
const randKen = () => kenRep[Math.floor(Math.random() * kenRep.length)]

bot.hears('ris', ctx => {
	const msg = ctx.update?.message
	const text = msg?.text
	const reply = msg?.reply_to_message?.text
	if (!reply) return
	ctx.replyWithPhoto(randRis(), { reply_to_message_id: msg?.reply_to_message?.message_id })
})

const charts = [
	'mdr ce coin de singe',
	`pk tu check le prix ? tu voit pas que ton destin c de perde de l'argent ?`,
	'shitcoin spotted',
	'tu fait honte a tes parents, sale chomeur, c dla merde ce coin',
	`............ regardez le..
	encore en train d'esperer que son shitcoin pump mdr`,
	'ce coin de grosse tantouze mdr',
	'wsh t pauvre assume non ? apporte moi une canette il sert a rien ce coin',
	'olalala.. apelle moi quand tu trouvera un vrai coin..',
	`pire shitcoin tu meur`,
	`tu compte etre riche avec ca ? MDR`,
	`ce pauvre type ne sait plus quoi buy`,
	`vrmt jte pensait pas aussi con, hold du BTC plutot -_-`,
	'ptin meme moi je buy pas des merde pareil',
	'lol.. encore un coin de gitan homosexuel',
	'ya pas plus gayouz que ce shitcoin',
	'gros autant buy du xbl a ce compte la..'
]

const any = [
	'jte pensait pas aussi con',
	`qui s'en fou ?`,
	'genre ? attend jmen branle',
	`c marren quand mm que personne s'interesse a ta vie`,
	'magnifique..',
	'oui',
	`j'aprouve`,
	`assez d'accord..`,
	'c pas fau',
	'attend mdr g vrmt pas lu',
	'hein ?',
	'pk tu parle comme un singe',
	'mais mec tg',
	'jtecoute absolument pas',
	'pk',
	'tkt pas',
	`t vrmt un putin d'insecure`,
	'btc va pump soon',
	'mdr..',
	'devons nous te considérer comme une divinité ?',
	'Ouvrez les yeux sur ki est vraiment cet homme fourbe',
	'oklm'
]
const randChart = () => charts[Math.floor(Math.random() * charts.length)]
const randAny = () => any[Math.floor(Math.random() * any.length)]
const getGif = async tag =>
	rp.get(`https://api.giphy.com/v1/gifs/random?tag=${tag}&api_key=${GIF_KEY}`).then(JSON.parse)
const coll = getColl()

const isReplyToArmand = msg =>
	msg?.reply_to_message?.from?.id === 800151780 || msg?.text?.toLowerCase()?.includes('armand')

bot.on('message', ctx => {
	const msg = ctx.update?.message?.text
	if (!msg) return
	if (`${ctx.chat.id}` !== TG_ROOM) return
	coll.then(coll => learnMsg(coll)(msg))
	if (msg.startsWith('/c')) {
		const last = replied.get('/c') || 0
		if (randBool() && Date.now() > last + 1000 * 60 * 5) {
			ctx.reply(randChart(), { reply_to_message_id: ctx?.update?.message?.message_id })
			replied.set('/c', Date.now())
		}
	} else if (Math.random() >= 0.97) {
		const last = replied.get('any') || 0
		if (Date.now() > last + 1000 * 60 * 10) {
			ctx.reply(randAny(), { reply_to_message_id: ctx?.update?.message?.message_id })
			replied.set('any', Date.now())
		}
	} else if (USE_IA) {
		coll.then(coll => {
			if (isReplyToArmand(ctx.update?.message) || Math.random() >= 0.9) {
				const response = getResponseToMsg(coll)(msg)
				if (response) {
					if (Math.random() >= 0.9)
						getGif(msgToEmotion(msg) || 'ok').then(({ data: { image_url } }) =>
							ctx.replyWithVideo(image_url, {
								reply_to_message_id: ctx?.update?.message?.message_id
							})
						)
					else
						response.then(resp =>
							ctx.reply(resp, { reply_to_message_id: ctx?.update?.message?.message_id })
						)
				}
			}
		})
	}
})

const kenArrayRegex = [
	/\bjbaise\b/,
	/\bjken\b/,
	/\bBAISE\b/,
	/\bJBAISE\b/,
	/\bBAIZ\b/,
	/\bBAIZE\b/,
	/\bjtebaiz\b/,
	/\bJTEBAIZ\b/,
	/\bjnik\b/,
	/\bniker\b/,
	/\bfuck\b/,
	/\bFUCK\b/,
	/\bjbaiz\b/,
	/\bsucer\b/,
	/\bchatte\b/,
	/\bchate\b/,
	/\bbaise\b/,
	/\bken\b/,
	/\bbaiz\b/,
	/\bbaiser\b/
]

pRep(kenArrayRegex)(3)(ctx =>
	ctx.reply(randKen(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

const fdpRegex = /\bfdp\b/
pRep(fdpRegex)(3)(ctx =>
	ctx.reply(randFdp(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

const marginRegex = /\bmargin\b/
pRep(marginRegex)(3)(ctx =>
	ctx.reply(randMargin(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

const stpRegex = /\bstp\b/
pRep(stpRegex)(4)(ctx =>
	ctx.reply(randStp(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

const poll = () => {
	console.log('POLLING')
	cmc().then(msg => {
		console.log('POLLED')
		if (msg)
			bot.telegram.sendMessage(TG_ROOM, msg, {
				parse_mode: 'Markdown',
				disable_web_page_preview: true
			})
	})
}

const quotesBtc = [
	`Si un homme n'embrasse pas une femme au premier rendez-vous, c'est un gentleman. Au second, c'est qu'il est gay`,
	`Heureux de vivre comme une cigale`,
	`J'aimerais être gay juste pour faire chier les homophobest`,
	`Être gay n'est pas une invention occidentale. C'est une réalité humaine`,
	`- Êtes vous homosexuel, répondez à la question ! Êtes vous un homo ? Êtes vous une pédale, une tapette, une folle, une chochotte un empaffé, un de la jaquette, une tantouse ? ÊTES VOUS GAY `,
	`Cela ne devrait jamais être un crime d'être gay`,
	`Il est gay comme un poisson dans l'eau`,
	`Où est le cyclope gay ?`,
	`Eh bien voila, ton fils est gay`,
	`Être gay n'est pas quelque chose que l'on décide, mais être homophobe oui`,
	`C'est vraiment un drôle de gay mon poto Michou. Il écopa du coup du sobriquet de broute-de-train`,
	`Tout gay est un homophobe qui s'ignore !`
]

const randGay = () => quotesBtc[Math.floor(Math.random() * quotesBtc.length)]

const getNudes = async () =>
	rp
		.get(`https://api.giphy.com/v1/gifs/random?tag=sexy&rating=R&api_key=${GIF_KEY}`)
		.then(JSON.parse)

const pollBtc = () => {
	btcUp().then(percent => {
		if (percent > 5) {
			bot.telegram.sendMessage(
				TG_ROOM,
				`${randGay()}

*le BTC est up ${percent.toFixed(2)}% aujourd'hui* 🍆`,
				{
					parse_mode: 'Markdown',
					disable_web_page_preview: true
				}
			)
			getGif('money').then(({ data: { image_url } }) => bot.telegram.sendVideo(TG_ROOM, image_url))
		}
	})
}

bot.telegram.sendMessage(
	TG_ROOM,
	`Oh Oh Oh ! *Je suis armand* le bot qui parle chinois.
Je vient de me mettre a jour en version *${VERSION}* 🎉`,
	{ parse_mode: 'Markdown' }
)

getGif('dancing').then(({ data: { image_url } }) => bot.telegram.sendVideo(TG_ROOM, image_url))

setInterval(() => poll(), 1000 * 60 * 23)
setInterval(() => pollBtc(), 1000 * 60 * 60)

const getRandTimeBetween = min => max => Math.floor(Math.random() * (max - min + 1) + min)

const sendNudes = () => {
	getNudes()
		.then(({ data: { image_url } }) => bot.telegram.sendVideo(TG_ROOM, image_url))
		.then(() => setTimeout(() => sendNudes(), 1000 * 60 * getRandTimeBetween(40)(400)))
}

setTimeout(sendNudes, 1000 * 60 * getRandTimeBetween(12)(26))

setInterval(() => {
	http.get('http://armandbot.herokuapp.com/')
}, 300000)

bot.startPolling()
