import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'
import { StreamModel } from '@/src/modules/stream/models/stream.model'

import { SocialLinkModel } from '../../profile/model/social-link.model'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public username: string

	@Field(() => String)
	public displayName: string

	@Field(() => String)
	public email: string

	@Field(() => String)
	public password: string

	@Field(() => String, { nullable: true })
	public avatar: string

	@Field(() => String, { nullable: true })
	public bio: string

	@Field(() => Boolean)
	public isEmailVerified: boolean
	@Field(() => Boolean)
	public isTotpEnabled: boolean

	@Field(() => Boolean)
	public isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	public deactivatedAt: Date

	@Field(() => [SocialLinkModel])
	public socialLinks: SocialLinkModel[]

	@Field(() => StreamModel)
	public stream: StreamModel

	@Field(() => String, { nullable: true })
	public totpSecret: string

	@Field(() => Boolean)
	public isVerified: boolean

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
