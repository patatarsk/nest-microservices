import { RecoverPasswordDto } from './../dto/recover-password.dto';
import { AppService } from '../gateway.service';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RecoverPasswordQueryDto } from 'src/dto/recover-password-query.dto';
import { RecoverPasswordBodyDto } from 'src/dto/recover-password-body.dto';
import { RecoverPasswordParamsDto } from 'src/dto/recover-password-params.dto';

@Controller('auth')
export class AuthController {
  constructor(private appService: AppService) {}

  @Post('/signup')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.appService.signUpUser(signUpUserDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() authUserDto: AuthUserDto, @Request() req) {
    const { _id } = req.user;

    return this.appService.login({ ...authUserDto, _id });
  }

  @Post('/:username/recover-password-request')
  @HttpCode(HttpStatus.ACCEPTED)
  recoverPasswordRequest(@Param() recoverPasswordDto: RecoverPasswordDto) {
    const { username } = recoverPasswordDto;
    return this.appService.recoverPasswordRequest(username);
  }

  @Post('/recover-password/:email')
  recoverPassword(
    @Param() params: RecoverPasswordParamsDto,
    @Query() query: RecoverPasswordQueryDto,
    @Body() body: RecoverPasswordBodyDto,
  ) {
    const { email } = params;
    const { token } = query;
    const { password, confirm } = body;
    return this.appService.recoverPassword(email, token, password, confirm);
  }
}
