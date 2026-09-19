import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

// Site 4 farklı sayfada ayrı S.S.S. blokları gösteriyor (genel + 3 hizmet
// sayfası); scope hangi sayfanın FAQPage şemasını/accordion'unu beslediğini
// belirler. 'genel' anasayfa + /sss sayfasında kullanılır.
export type FaqScope = 'genel' | 'panel-temizlik' | 'panel-bakim' | 'robot-satisi'

export const FAQ_SCOPES: FaqScope[] = ['genel', 'panel-temizlik', 'panel-bakim', 'robot-satisi']

@Entity('faqs')
@Index(['published', 'scope', 'sortOrder'])
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 30, default: 'genel' })
  scope: FaqScope

  @Column()
  question: string

  @Column({ type: 'text' })
  answer: string

  @Column({ default: true })
  published: boolean

  @Column({ default: 0 })
  sortOrder: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
