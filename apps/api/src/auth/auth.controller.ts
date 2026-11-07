import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateOrganizationDto, LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';
import { Public } from '../common/public.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from './auth.types';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.auth.register(dto, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    if (!dto.refreshToken) {
      return this.auth.refresh('');
    }
    return this.auth.refresh(dto.refreshToken);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.auth.me(user.id);
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@CurrentUser() user: RequestUser, @Body() dto: RefreshDto) {
    return this.auth.logout(user.id, dto.refreshToken);
  }

  @ApiBearerAuth()
  @Post('organizations')
  createOrganization(@CurrentUser() user: RequestUser, @Body() dto: CreateOrganizationDto) {
    return this.auth.createOrganization(user.id, dto);
  }
}
