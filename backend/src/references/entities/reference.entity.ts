import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('references')
@Index(['published', 'sortOrder'])
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  logo: string

  // Bazı logolar (uzun/dar oranlı) diğerlerine göre daha küçük basılıyor;
  // admin panelden görsel dengeyi ince ayarlamak için ölçek çarpanı.
  @Column({ type: 'numeric', precision: 3, scale: 2, default: 1.0 })
  scale: number

  @Column({ default: true })
  published: boolean

  @Column({ default: 0 })
  sortOrder: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
