import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis {
	public constructor(private readonly configService: ConfigService) {
		super({
			host: configService.get<string>('REDIS_HOST'),
			port: parseInt(configService.get<string>('REDIS_PORT')),
			// username: configService.get<string>('REDIS_USER'),
			password: configService.get<string>('REDIS_PASSWORD')
		})
	}
}
