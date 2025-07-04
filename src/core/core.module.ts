import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../modules/auth/account/account.module'
import { DeactivateModule } from '../modules/auth/deactivate/deactivate.module'
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module'
import { ProfileModule } from '../modules/auth/profile/profile.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { TotpModule } from '../modules/auth/totp/totp.module'
import { VerificationModule } from '../modules/auth/verification/verification.module'
import { CronModule } from '../modules/cron/cron.module'
import { LivekitModule } from '../modules/libs/livekit/livekit.module'
import { MailModule } from '../modules/libs/mail/mail.module'
import { StorageModule } from '../modules/libs/storage/storage.module'
import { IngressModule } from '../modules/stream/ingress/ingress.module'
import { StreamModule } from '../modules/stream/stream.module'
import { IS_DEV_ENV } from '../shared/util/is-dev.util'

import { getGraphQLConfig } from './config/graphql.config'
import { getLivekitConfig } from './config/livekit.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		LivekitModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getLivekitConfig,
			inject: [ConfigService]
		}),
		AccountModule,
		SessionModule,
		PrismaModule,
		RedisModule,
		MailModule,
		CronModule,
		StorageModule,

		StreamModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		ProfileModule,
		IngressModule
	]
})
export class CoreModule {}
