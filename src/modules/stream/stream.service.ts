import { Injectable } from '@nestjs/common'
import { FileUpload } from 'graphql-upload'
import * as sharp from 'sharp'

import { Prisma, type User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { StorageService } from '../libs/storage/storage.service'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filters.input'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined
		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,

			where: { user: { isDeactivated: false }, ...whereClause },
			include: { user: true },
			orderBy: { createdAt: 'desc' }
		})
		return streams
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: { user: { isDeactivated: false } }
		})
		const randomIndexes = new Set<number>()

		while (randomIndexes.size < 4) {
			const randomIndex = Math.floor(Math.random() * total)
			randomIndexes.add(randomIndex)
		}

		const streams = await this.prismaService.stream.findMany({
			where: { user: { isDeactivated: false } },
			include: { user: true },
			take: total,
			skip: 0
		})

		return Array.from(randomIndexes).map(index => streams[index])
	}

	public async changeInfo(user: User, input: ChangeStreamInfoInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { title, categoryId } = input
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { title }
		})
		return true
	}

	public async changeThumbnail(user: User, file: FileUpload) {
		const stream = await this.findByUserId(user)
		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		const chunks: Buffer[] = []
		for await (const chunk of file.createReadStream()) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/streams/${user.username}.webp`

		if (file.filename && file.filename.endsWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer()
			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer()
			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		}
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				thumbnailUrl: fileName
			}
		})

		return true
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user)
		if (!stream.thumbnailUrl) {
			return
		}
		await this.storageService.remove(stream.thumbnailUrl)
		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				thumbnailUrl: null
			}
		})
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: { userId: user.id }
		})
		return stream
	}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{ title: { contains: searchTerm, mode: 'insensitive' } },
				{
					user: {
						username: { contains: searchTerm, mode: 'insensitive' }
					}
				}
			]
		}
	}
}
