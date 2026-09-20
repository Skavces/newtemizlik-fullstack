import { ConsoleLogger, Injectable } from '@nestjs/common'
import { LogsService } from './logs.service'
import { redactUrlSecrets } from '../common/redact'

// Uygulama genelinde Logger.error/warn çağrılarını veritabanına kopyalayan logger.
// main.ts'te app.useLogger(app.get(DbLogger)) ile devreye girer; admin panel Loglar sayfası okur.
@Injectable()
export class DbLogger extends ConsoleLogger {
  constructor(private readonly logs: LogsService) {
    super()
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    const [safeMessage, safeParams] = this.redactAll(message, optionalParams)
    super.error(safeMessage, ...safeParams)
    void this.logs.record('error', this.stringify(safeMessage), this.extractContext(safeParams))
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    const [safeMessage, safeParams] = this.redactAll(message, optionalParams)
    super.warn(safeMessage, ...safeParams)
    void this.logs.record('warn', this.stringify(safeMessage), this.extractContext(safeParams))
  }

  // Nest konvansiyonu: son parametre çok satırlı değilse context adıdır (örn. "ChatService")
  private extractContext(optionalParams: unknown[]): string | undefined {
    const last = optionalParams[optionalParams.length - 1]
    return typeof last === 'string' && !last.includes('\n') ? last : undefined
  }

  // Savunma derinliği: çağrı yeri sır redaksiyonunu unutsa bile, error/warn'a
  // giren TÜM string argümanlar burada maskelenir — hem konsola (super.error/warn,
  // yani Docker log/log shipper'ın gördüğü tek kanal) hem veritabanına giden
  // kopya için. Önceden yalnızca veritabanına yazılan kopya redakte ediliyordu;
  // super.error(message, ...optionalParams) ham haliyle çağrılıyordu, yani bir
  // sır konsola düz metin sızabiliyordu ama admin panel Loglar sayfasında
  // maskeli görünüyordu — redaksiyon garantisi göründüğünden dar kapsamlıydı.
  private redactAll(message: unknown, optionalParams: unknown[]): [unknown, unknown[]] {
    return [this.redactValue(message), optionalParams.map((p) => this.redactValue(p))]
  }

  private redactValue(value: unknown): unknown {
    return typeof value === 'string' ? redactUrlSecrets(value) : value
  }

  private stringify(message: unknown): string {
    const text = typeof message === 'string' ? message : JSON.stringify(message)
    return redactUrlSecrets(text)
  }
}
