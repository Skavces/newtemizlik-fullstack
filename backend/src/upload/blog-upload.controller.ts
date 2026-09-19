import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { UPLOADS_DIR } from './uploaded-files'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { BlogService } from '../blog/blog.service'
import { imageStorage, ALLOWED_IMAGE_MIMES, logoFilter, assertMagicBytes, toWebp, saveWithSeoName } from './upload.utils'

@Controller('upload/blog')
export class BlogUploadController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file', { storage: imageStorage, fileFilter: logoFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Geçerli bir görsel yükleyin (JPEG, PNG veya WEBP)')
    // Multer dosyayı controller çalışmadan önce diske yazar; bu noktadan sonra
    // hangi adımda hata olursa olsun diskte artık dosya bırakılmamalı
    let currentPath = file.path
    try {
      // Önce post var mı: 404'ü görsel işlenmeden ver
      const post = await this.blogService.findById(id)
      await assertMagicBytes(currentPath, ALLOWED_IMAGE_MIMES)
      currentPath = await toWebp(currentPath)
      const coverImage = await saveWithSeoName(currentPath, post.slug, '.webp')
      currentPath = join(UPLOADS_DIR, coverImage.replace('/uploads/', ''))
      return await this.blogService.update(id, { coverImage })
    } catch (err) {
      // assertMagicBytes kendi hatasında dosyayı zaten silmiş olabilir — sessiz geç
      await unlink(currentPath).catch(() => {})
      throw err
    }
  }

  // Tiptap editöründe yazı gövdesine resim eklemek için — kapak görselinin
  // aksine bir kayıt id'si istemez (yeni yazı henüz kaydedilmemişken de
  // editöre resim konulabilsin diye). Dönen URL editör tarafından <img src>
  // olarak metne gömülür; sahiplenilmeyen (hiçbir yazının content'inde
  // geçmeyen) dosyalar haftalık orphan-cleanup tarafından temizlenir (bkz.
  // uploads-cleanup.service.ts).
  @UseGuards(JwtAuthGuard)
  @Post('content-image')
  @UseInterceptors(FileInterceptor('file', { storage: imageStorage, fileFilter: logoFilter, limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadContentImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Geçerli bir görsel yükleyin (JPEG, PNG veya WEBP)')
    let currentPath = file.path
    try {
      await assertMagicBytes(currentPath, ALLOWED_IMAGE_MIMES)
      currentPath = await toWebp(currentPath)
      const url = await saveWithSeoName(currentPath, 'blog-icerik', '.webp')
      return { url }
    } catch (err) {
      await unlink(currentPath).catch(() => {})
      throw err
    }
  }
}
