import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReferenceUploadController } from './reference-upload.controller'
import { BlogUploadController } from './blog-upload.controller'
import { UploadsCleanupService } from './uploads-cleanup.service'
import { ReferencesModule } from '../references/references.module'
import { BlogModule } from '../blog/blog.module'
import { BlogPost } from '../blog/entities/blog-post.entity'
import { Reference } from '../references/entities/reference.entity'

@Module({
  imports: [ReferencesModule, BlogModule, TypeOrmModule.forFeature([BlogPost, Reference])],
  controllers: [ReferenceUploadController, BlogUploadController],
  providers: [UploadsCleanupService],
})
export class UploadModule {}
