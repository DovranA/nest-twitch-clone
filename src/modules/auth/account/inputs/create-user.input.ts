import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	public username: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string
}
