import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../common/permissions.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @RequirePermissions('admin:tenants')
  @Get('overview')
  overview(): Promise<{
    indicators: Record<string, number | string>;
    featureFlags: Array<{ key: string; enabled: boolean; description: string | null }>;
    notes: string[];
  }> {
    return this.admin.overview();
  }
}
