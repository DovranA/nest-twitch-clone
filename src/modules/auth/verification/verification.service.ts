import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'

import { TokenType, type User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/util/generate.util'
import { getSessionMetadata } from '@/src/shared/util/session-metadata.util'
import { saveSession } from '@/src/shared/util/session.util'

import { MailService } from '../../libs/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.EMAIL_VERIFY }
		})
		if (!existingToken) {
			throw new NotFoundException("Token don't found")
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token is expired')
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.EMAIL_VERIFY }
		})

		const metadata = getSessionMetadata(req, userAgent)
		return saveSession(req, user, metadata)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		)
		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		)
		return true
	}
}
