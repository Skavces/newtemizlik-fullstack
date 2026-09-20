import { DbLogger } from '../db-logger.service'
import { LogsService } from '../logs.service'

function makeLogger() {
  const logs = { record: jest.fn().mockResolvedValue(undefined) } as unknown as jest.Mocked<LogsService>
  return { logger: new DbLogger(logs), logs }
}

describe('DbLogger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
    jest.spyOn(process.stderr, 'write').mockImplementation(() => true)
  })

  afterEach(() => jest.restoreAllMocks())

  it('error çağrısını context ile birlikte kaydeder', () => {
    const { logger, logs } = makeLogger()
    logger.error('bir şeyler patladı', 'ChatService')
    expect(logs.record).toHaveBeenCalledWith('error', 'bir şeyler patladı', 'ChatService')
  })

  it('warn çağrısını da kaydeder', () => {
    const { logger, logs } = makeLogger()
    logger.warn('dil sızıntısı', 'ChatService')
    expect(logs.record).toHaveBeenCalledWith('warn', 'dil sızıntısı', 'ChatService')
  })

  it('çok satırlı son parametreyi (stack trace) context saymaz', () => {
    const { logger, logs } = makeLogger()
    logger.error('patladı', 'Error: x\n    at foo()')
    expect(logs.record).toHaveBeenCalledWith('error', 'patladı', undefined)
  })

  it('string olmayan mesajı JSON\'a çevirir', () => {
    const { logger, logs } = makeLogger()
    logger.error({ code: 42 }, 'ChatService')
    expect(logs.record).toHaveBeenCalledWith('error', '{"code":42}', 'ChatService')
  })

  it('DB kopyasında sorgu-parametre biçimindeki sırları maskeler', () => {
    const { logger, logs } = makeLogger()
    logger.error('Token yenileme başarısız: ?access_token=IGQWReallyLiveToken', 'InstagramTokenService')
    expect(logs.record).toHaveBeenCalledWith(
      'error',
      'Token yenileme başarısız: ?access_token=[REDACTED]',
      'InstagramTokenService',
    )
  })

  it('konsola (Nest ConsoleLogger process.stderr.write üzerinden yazar) da redakte edilmiş metni yazar — DB kopyasıyla aynı garanti tek bir sinke özel değil', () => {
    const { logger } = makeLogger()
    const stderrSpy = process.stderr.write as jest.Mock
    logger.error('Token yenileme başarısız: ?access_token=IGQWReallyLiveToken', 'InstagramTokenService')
    const printed = stderrSpy.mock.calls.map((c) => String(c[0])).join(' ')
    expect(printed).not.toContain('IGQWReallyLiveToken')
    expect(printed).toContain('access_token=[REDACTED]')
  })

  it('optionalParams içindeki sır taşıyan string context de konsolda maskelenir (warn -> stdout)', () => {
    const { logger } = makeLogger()
    const stdoutSpy = process.stdout.write as jest.Mock
    logger.warn('istek başarısız', 'https://api.example.com/x?token=SUPERSECRET')
    const printed = stdoutSpy.mock.calls.map((c) => String(c[0])).join(' ')
    expect(printed).not.toContain('SUPERSECRET')
  })
})
