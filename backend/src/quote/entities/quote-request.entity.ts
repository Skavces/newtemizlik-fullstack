import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export type QuoteStatus = 'new' | 'contacted' | 'won' | 'lost'

// Mevcut iletişim formunun (formsubmit.co) alanlarının birebir karşılığı —
// bkz. NewTemizlik Contact.jsx: Ad_Soyad, Telefon, E_Posta, Panel_Adeti,
// Saha_Megavati, Su_Ulasimi_Var_Mi.
@Entity('quote_requests')
export class QuoteRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // KVKK temizliğinde null'lanır; NOT NULL kolon değil
  @Column({ type: 'varchar', length: 120, nullable: true })
  adSoyad: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefon: string | null

  @Column({ type: 'varchar', length: 120, nullable: true })
  ePosta: string | null

  @Column({ type: 'integer' })
  panelAdeti: number

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  sahaMegavati: number

  @Column({ type: 'boolean' })
  suUlasimi: boolean

  @Column({ default: false })
  kvkkConsent: boolean

  @Column({ type: 'timestamp' })
  consentAt: Date

  // 'new' = henüz aranmadı, 'contacted' = iletişime geçildi, 'won'/'lost' = sonuçlandı
  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: QuoteStatus

  @Index()
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
