import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TotpModel {
	@Field(() => String)
	public qrCodeUrl: string

	@Field(() => String)
	public secret: string
}
