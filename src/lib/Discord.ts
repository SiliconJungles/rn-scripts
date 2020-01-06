import Shell from './Shell'
const request = require('request')

type DiscordParams = {
	webhook: string,
	title: string,
	qr_code?: string,
	description?: string,
	url?: string,
	status?: 'success' | 'error'
	fields?: object
}

export async function post(params: DiscordParams): Promise<void> {
	let p: any = {}
	p['payload_json'] = JSON.stringify({
		content: params.title,
		embeds:[{
			title: params.title,
			description: params.description,
			url: params.url,
			color: map_color(params.status),
			fields: map_fields(params.fields)
		}]
	})
	if (params.qr_code) {
		p['files'] = {
			value: qr_code(params.qr_code),
			options: {
				filename: 'url.png',
				contentType: 'image/png'
			}
		}
	}
	await new Promise((res, rej) => {
		request.post({
			url: `https://discordapp.com/api/webhooks/${params.webhook}`,
			method: 'POST',
			formData: p
		}, (err:any,resp:any,body:any)=>{
			if (resp) res()
			rej(err)
		})
	})
}

function map_fields(fields: any): {name:string, value:string}[] {
	if (!fields) return []
	return Object.keys(fields).map(k=> {
		return {
			name: k,
			value: fields[k]
		}
	})
}

function map_color(status?: 'success' | 'error'): number {
	if ('success' === status) {
		return 3066993
	} else if ('error' === status) {
		return 15158332
	}
	return 7374810
}

function qr_code(content: string): any {
	let qr = require('qr-image')
	return qr.imageSync(content, { type: 'png' })
}
