import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '../types/session-metadata.types'

import { IS_DEV_ENV } from './is-dev.util'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

import DeviceDetector = require('device-detector-js')

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '173.166.164.121'
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip)

	const location = lookup(ip)
	const device = new DeviceDetector().parse(userAgent)
	return {
		location: {
			country:
				countries.getName(location.country, 'en') ||
				'Undefined country',
			city: location.city || 'Undefined city',
			latitude: location.ll[0] || 0,
			longitude: location.ll[1] || 1
		},
		device: {
			browser: device.client.name,
			os: device.os.name,
			type: device.device.type
		},
		ip
	}
}
