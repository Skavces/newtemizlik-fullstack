import { Body, Controller, Delete, Get, Header, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { FaqService } from './faq.service'
import { CreateFaqDto } from './dto/create-faq.dto'
import { UpdateFaqDto } from './dto/update-faq.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ReorderDto } from '../common/dto/reorder.dto'
import { FAQ_SCOPES } from './entities/faq.entity'

@Controller('faq')
export class FaqController {
  constructor(private readonly service: FaqService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60')
  findAll(@Query('scope') scope?: string) {
    const narrowed = FAQ_SCOPES.find(s => s === scope)
    return this.service.findAllPublicByScope(narrowed)
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.service.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFaqDto) {
    return this.service.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.service.reorder(dto.orderedIds)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.service.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
