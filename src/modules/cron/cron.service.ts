import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismService: PrismaService,
		private readonly mailService: MailService
	) {}

	@Cron('*/10 * * * * *')
	public async deleteDeactivatedAccount() {
		console.log('Subscribe to our chanel')
	}
}
