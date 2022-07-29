import { AppService } from './app.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

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
}
