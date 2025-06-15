import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService
	) {}

	// @Cron('0/10 * * * * *')
	@Cron('0 0 * * *')
	public async deleteDeactivatedAccount() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7)
		const deactivatedAccounts = await this.prismService.user.findMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } }
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(user.email)

			await this.storageService.remove(user.avatar)
		}
		await this.prismService.user.deleteMany({
			where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } }
		})
	}
}
