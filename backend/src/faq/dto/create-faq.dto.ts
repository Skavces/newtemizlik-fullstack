import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { FAQ_SCOPES } from '../entities/faq.entity'
import type { FaqScope } from '../entities/faq.entity'

export class CreateFaqDto {
  @IsOptional()
  @IsIn(FAQ_SCOPES, { message: 'Geçersiz kapsam' })
  scope?: FaqScope

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  answer: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  published?: boolean

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2147483647)
  @Type(() => Number)
  sortOrder?: number
}
