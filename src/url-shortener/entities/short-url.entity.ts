import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shortCode: string; // Stores Base62-encoded hash

  @Column({ unique: true })
  originalUrl: string; // The long URL

  @CreateDateColumn()
  createdAt: Date;
}
