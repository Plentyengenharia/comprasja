import { Module } from '@nestjs/common';
import { ProcurementsController } from './procurements.controller';
import { ProcurementsService } from './procurements.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProcurementsController],
  providers: [ProcurementsService],
})
export class ProcurementsModule {}
