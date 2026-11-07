import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProcurementsService } from './procurements.service';
import { Public } from '../common/public.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../auth/auth.types';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../common/permissions.decorator';

@ApiTags('procurements')
@Controller({ path: 'procurements', version: '1' })
export class ProcurementsController {
  constructor(private readonly procurements: ProcurementsService) {}

  @Public()
  @Get('public')
  listPublic(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') q?: string,
    @Query('state') state?: string,
  ) {
    return this.procurements.listPublic({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
      q,
      state,
    });
  }

  @Public()
  @Get('public/:id')
  getPublic(@Param('id') id: string) {
    return this.procurements.getPublic(id);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('procurement:read')
  @Get('org/:organizationId')
  listOrg(@CurrentUser() user: RequestUser, @Param('organizationId') organizationId: string) {
    return this.procurements.listForOrg(user, organizationId);
  }
}
