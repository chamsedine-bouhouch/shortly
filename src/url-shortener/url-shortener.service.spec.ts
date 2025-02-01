import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

const mockShortUrlRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let repo: Repository<ShortUrl>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: getRepositoryToken(ShortUrl), useFactory: mockShortUrlRepo },
        Logger,
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    repo = module.get<Repository<ShortUrl>>(getRepositoryToken(ShortUrl));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return an existing short code if URL is already shortened', async () => {
      const existingShortUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(existingShortUrl);

      const result = await service.create('https://example.com');
      expect(result).toEqual(existingShortUrl.shortCode);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { originalUrl: 'https://example.com' },
      });
    });

    it('should generate and save a new short code for a new URL', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'save').mockResolvedValue({
        id: 2,
        shortCode: 'xyz789',
        originalUrl: 'https://new-url.com',
        createdAt: new Date(),
      });

      const result = await service.create('https://new-url.com');
      expect(result).toBeDefined();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findByShortCode', () => {
    it('should return the original URL for a valid short code', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue({
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
      });

      const result = await service.findByShortCode('abc123');
      expect(result).toEqual('https://example.com');
    });

    it('should return null for a non-existent short code', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      const result = await service.findByShortCode('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all shortened URLs', async () => {
      const shortUrls = [
        {
          id: 1,
          originalUrl: 'https://example.com',
          shortCode: 'abc123',
          createdAt: new Date(),
        },
        {
          id: 2,
          originalUrl: 'https://another.com',
          shortCode: 'def456',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(repo, 'find').mockResolvedValue(shortUrls);

      const result = await service.findAll();
      expect(result).toEqual(shortUrls);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('deleteByShortCode', () => {
    it('should delete a short URL by its short code', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1, raw: 0 });

      await expect(service.removeByShortCode('abc123')).resolves.not.toThrow();
      expect(repo.delete).toHaveBeenCalledWith({ shortCode: 'abc123' });
    });
  });
});
