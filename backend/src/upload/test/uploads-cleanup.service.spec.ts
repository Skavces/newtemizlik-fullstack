import { mkdtemp, rm, writeFile, utimes, readdir } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { Repository } from 'typeorm'
import { BlogPost } from '../../blog/entities/blog-post.entity'
import { Reference } from '../../references/entities/reference.entity'
import { UploadsCleanupService } from '../uploads-cleanup.service'

// UPLOADS_DIR sabitini geçici test dizinine yönlendir
let mockUploadsDir: string
jest.mock('../uploaded-files', () => ({
  get UPLOADS_DIR() {
    return mockUploadsDir
  },
}))

function makeService(referenced: { covers?: string[]; logos?: string[]; contents?: string[] }) {
  const blogRepo = {
    // collectReferencedFilenames iki ayrı find() çağrısı yapar: biri
    // coverImage için, biri de gövdedeki gömülü görselleri taramak üzere
    // content için (bkz. Faz 4 planı) — hangisi olduğunu `select` ile ayırt et.
    find: jest.fn((opts?: { select?: string[] }) => {
      if (opts?.select?.includes('content')) {
        return Promise.resolve((referenced.contents ?? []).map(content => ({ content })))
      }
      return Promise.resolve((referenced.covers ?? []).map(coverImage => ({ coverImage })))
    }),
  } as unknown as Repository<BlogPost>
  const referenceRepo = {
    find: jest.fn().mockResolvedValue((referenced.logos ?? []).map(logo => ({ logo }))),
  } as unknown as Repository<Reference>

  return new UploadsCleanupService(blogRepo, referenceRepo)
}

async function createFile(name: string, ageHours: number) {
  const path = join(mockUploadsDir, name)
  await writeFile(path, 'x')
  const mtime = new Date(Date.now() - ageHours * 60 * 60 * 1000)
  await utimes(path, mtime, mtime)
}

describe('UploadsCleanupService', () => {
  beforeEach(async () => {
    mockUploadsDir = await mkdtemp(join(tmpdir(), 'uploads-cleanup-'))
  })

  afterEach(async () => {
    await rm(mockUploadsDir, { recursive: true, force: true })
  })

  it('should delete old unreferenced files but keep referenced and fresh ones', async () => {
    await createFile('referenced.webp', 48)
    await createFile('orphan-old.webp', 48)
    await createFile('orphan-fresh.webp', 1)
    await writeFile(join(mockUploadsDir, '.gitkeep'), '')

    const service = makeService({ covers: ['/uploads/referenced.webp'] })
    const deleted = await service.run()

    expect(deleted).toBe(1)
    const remaining = await readdir(mockUploadsDir)
    expect(remaining.sort()).toEqual(['.gitkeep', 'orphan-fresh.webp', 'referenced.webp'])
  })

  it('should honour references from blog covers and reference logos', async () => {
    await createFile('cover.webp', 48)
    await createFile('logo.webp', 48)
    await createFile('gone.webp', 48)

    const service = makeService({
      covers: ['/uploads/cover.webp'],
      logos: ['/uploads/logo.webp'],
    })
    const deleted = await service.run()

    expect(deleted).toBe(1)
    const remaining = await readdir(mockUploadsDir)
    expect(remaining.sort()).toEqual(['cover.webp', 'logo.webp'])
  })

  it('should delete nothing when every file is referenced', async () => {
    await createFile('a.webp', 48)
    await createFile('b.webp', 48)

    const service = makeService({ covers: ['/uploads/a.webp'], logos: ['/uploads/b.webp'] })

    await expect(service.run()).resolves.toBe(0)
  })

  it('should keep files referenced only inside blog post content HTML', async () => {
    await createFile('gomulu-gorsel.webp', 48)
    await createFile('gone.webp', 48)

    const service = makeService({
      contents: ['<p>metin</p><img src="/uploads/gomulu-gorsel.webp" alt="x">'],
    })
    const deleted = await service.run()

    expect(deleted).toBe(1)
    const remaining = await readdir(mockUploadsDir)
    expect(remaining.sort()).toEqual(['gomulu-gorsel.webp'])
  })

  it('should keep every image referenced in a content field with multiple images', async () => {
    await createFile('birinci.webp', 48)
    await createFile('ikinci.webp', 48)

    const service = makeService({
      contents: [
        '<img src="/uploads/birinci.webp">',
        '<p>ikinci yazı</p><img src="/uploads/ikinci.webp">',
      ],
    })

    await expect(service.run()).resolves.toBe(0)
  })
})
