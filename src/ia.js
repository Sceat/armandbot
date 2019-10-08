import { MongoClient } from 'mongodb'
const { MONGO_URI } = process.env

const maxEnergy = 30
let energy = maxEnergy
const regenEvery = 1000 * 60 * 1

setInterval(() => {
	if (energy < maxEnergy) energy++
}, regenEvery)

const emotions = {
	AGREE: {
		parse: [
			'oui',
			'yep',
			'oe',
			'ouai',
			'ouaip',
			'yes',
			'indeed',
			'effectivement',
			'c sur',
			'sure',
			'wai',
			'ui',
			'moe',
			'mwai',
			'mouai'
		],
		respondTo: ['AGREE', 'AFFIRM', 'ASK']
	},
	DISAGREE: {
		parse: ['nn', 'non', 'nop', 'bof', 'depend', 'pas', 'ne'],
		respondTo: ['DISAGREE', 'AFFIRM', 'ASK']
	},
	HAPPY: {
		parse: [
			'cool',
			'super',
			'top',
			'genial',
			'nice',
			'haha',
			'mdr',
			'excelent',
			'excellent',
			'nikel',
			'bien'
		],
		respondTo: ['HAPPY', 'SURPRISE', 'AFFIRM', 'SAD']
	},
	SAD: {
		parse: [
			'shit',
			'ptin',
			'aie',
			'dommage',
			'chier',
			'mince',
			'rip',
			'rekt',
			'ouch',
			'ca pique',
			'...',
			'oh nn',
			'tin',
			'roh',
			'vdm',
			'fml',
			'berk'
		],
		respondTo: ['DISAGREE', 'SAD', 'ANGER']
	},
	ANGER: {
		parse: [
			'putin',
			'fdp',
			'conar',
			'enculer',
			'pd',
			'suce',
			'ntm',
			'chie',
			'lever',
			'faible',
			'mikel',
			'baise',
			'baiz',
			'nike',
			'fuck',
			'pute',
			'chibre',
			'verge',
			'falus',
			'mort',
			'merde',
			'couille',
			'esclave',
			'dechet',
			'boloss',
			'noob',
			'puta',
			'tryzo',
			'mere',
			'salope',
			'branle',
			'tg',
			'connard',
			'frapper',
			'jte prend',
			'1v1'
		],
		respondTo: ['AGREE', 'DISAGREE', 'HAPPY', 'SAD', 'ANGER', 'SURPRISE', 'ASK', 'AFFIRM', 'THANKS']
	},
	SURPRISE: {
		parse: ['wtf', 'what', 'insane', 'mec..', 'gros', 'cmt c possible', 'awai', 'damn', 'bordel'],
		respondTo: ['SURPRISE', 'ASK', 'AFFIRM']
	},
	ASK: {
		parse: ['?', 'hein', 'pk', 'cmt', 'comment', 'how', '??', '???', 'wut', 'coment', 'explique'],
		respondTo: ['SURPRISE', 'ASK', 'AFFIRM']
	},
	AFFIRM: {
		parse: ['!'],
		respondTo: ['ASK', 'AFFIRM', 'THANKS', 'AGREE', 'DISAGREE', 'SURPRISE']
	},
	THANKS: {
		parse: ['thx', 'merci', 'cimer', 'thanks'],
		respondTo: ['AFFIRM']
	}
}

export const msgToEmotion = msg => {
	const msgLow = msg.toLowerCase()
	for (let [emotion, obj] of Object.entries(emotions)) {
		for (let em of obj.parse) {
			if (msgLow.includes(em)) return emotion
		}
	}
	return Math.random() >= 0.7 ? 'AFFIRM' : undefined
}

const getSentenceOfEmotion = coll => async e => {
	const ss = await coll
		.find({ type: e })
		.limit(1)
		.toArray()
		.then(([obj]) => obj.speach)
	return ss[Math.floor(Math.random() * ss.length)]
}

const getResponseToEmotion = coll => e => {
	const possibleResponsesEmotion = []
	for (let [emotion, obj] of Object.entries(emotions)) {
		if (obj.respondTo.includes(e)) possibleResponsesEmotion.push(emotion)
	}
	return getSentenceOfEmotion(coll)(
		possibleResponsesEmotion[Math.floor(Math.random() * possibleResponsesEmotion.length)]
	)
}

export const insert = coll => {
	for (let [emotion, obj] of Object.entries(emotions))
	coll.insertOne({
		type: emotion,
		speach: []
	})
}

export const learnMsg = coll => async msg => {
	const e = msgToEmotion(msg)
	if (e) {
		const speach = await coll
			.find({ type: e })
			.limit(1)
			.toArray()
			.then(([obj]) => obj.speach)
		speach.push(msg)
		coll.updateOne({ type: e }, { $set: { speach: [...new Set(speach)] } })
	}
}

const noEnergy = [
	'laisse moi trkl',
	'jrepon plu',
	'ok',
	'tg',
	'laissez moi putin',
	`i'm out`,
	'jrepon plus bro',
	'wrong destinataire',
	'adresse toi a mon voiturier',
	'jparle pas au paysans',
	'jtai dit quoi, stop!'
]

const randHS = () => noEnergy[Math.floor(Math.random() * noEnergy.length)]

export const getResponseToMsg = coll => msg => {
	const e = msgToEmotion(msg)
	if (energy < 1) return Math.random() >= 0.5 ? new Promise(res => res(randHS())) : undefined
	if (!e) return
	energy--
	console.log(`${energy} energie restante`)
	return getResponseToEmotion(coll)(e)
}

export async function getColl() {
	const mongo = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true })
	return mongo.db('armand').collection('speach')
}

getColl().then(insert)