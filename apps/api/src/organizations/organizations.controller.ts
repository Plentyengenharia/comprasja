import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../auth/auth.types';
import { PermissionsGuard } from '../auth/permissions.guard';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Get('mine')
  mine(@CurrentUser() user: RequestUser) {
    return this.organizations.listMine(user);
  }

  @Get(':id')
  getOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.organizations.getOne(user, id);
  }
}
