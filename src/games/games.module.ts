import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';
import { GamesGateway } from './games.gateway';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  controllers: [GamesController],
  providers: [GamesService, PrismaService, GamesGateway, NotificationGateway],
})
export class GamesModule {}
