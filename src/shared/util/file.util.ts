import { ReadStream } from 'fs'

export function validateFileFormat(
	filename: string,
	allowedFileFormats: string[]
) {
	const filePart = filename.split('.')
	const extension = filePart[filePart.length - 1]
	return allowedFileFormats.includes(extension)
}

export async function validateFileSize(
	fileStream: ReadStream,
	allowedFileSizeInBytes: number
) {
	return new Promise((resolver, reject) => {
		let fileSizeInBytes = 0
		fileStream
			.on('data', (data: Buffer) => {
				fileSizeInBytes = data.byteLength
			})
			.on('end', () => {
				resolver(fileSizeInBytes <= allowedFileSizeInBytes)
			})
			.on('error', error => {
				reject(error)
			})
	})
}
