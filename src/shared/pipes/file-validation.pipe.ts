import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'fs'

import { validateFileFormat, validateFileSize } from '../util/file.util'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException("File did'n upload")
		}
		const { filename, createReadStream } = value
		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']

		const isFileFormatValid = validateFileFormat(filename, allowedFormats)
		if (!isFileFormatValid) {
			throw new BadRequestException('Not valid format')
		}

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024
		)

		if (!isFileFormatValid) {
			throw new BadRequestException('Max weight of file is 10MB')
		}
		return value
	}
}
