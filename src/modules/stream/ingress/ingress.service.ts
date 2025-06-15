import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LivekitService } from '../../libs/livekit/livekit.service'

@Injectable()
export class IngressService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}
}
