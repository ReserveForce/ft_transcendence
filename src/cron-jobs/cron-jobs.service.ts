import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class CronJobsService implements OnModuleInit {
    onModuleInit() {
        this.setupMuteExpirationJob();
    }

    constructor(private readonly prisma: PrismaService) {
        this.setupMuteExpirationJob();
    }
    private setupMuteExpirationJob() {
        const checkForExpiredMutesJob = new CronJob('*/1 * * * *', async () => {
            const expiredMutes = await this.prisma.channelMutes.findMany({
                where: {
                    until: {
                        lte: new Date(),
                    },
                },
            });

            for (const mute of expiredMutes) {
                await this.prisma.channelMutes.delete({
                    where: {
                        channel_id_user_id: {
                            channel_id: mute.channel_id,
                            user_id: mute.user_id,
                        },
                    },
                });
                // Additional logic to handle unmute action, if needed
            }
        });

        checkForExpiredMutesJob.start();
    }
}
