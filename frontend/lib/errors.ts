// Backend'den gelen HTTP hatalarını taşımak için ortak hata tipi. Nest'in
// standart hata gövdesi { statusCode, message, error } şeklinde — message
// validation hatalarında string dizisi, aksi halde string olabilir.
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}
