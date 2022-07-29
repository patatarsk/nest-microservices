import { bcryptConstants } from './constants';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @Inject('USERS_SERVICE') private usersService: ClientProxy,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signUpUser(signUpUserDto: SignUpUserDto): Promise<any> {
    const { email } = signUpUserDto;

    const getUser = await firstValueFrom(
      this.usersService.send({ cmd: 'users_find_by_email' }, email),
    );

    if (getUser) {
      throw new ConflictException('User already exists');
    }

    const password = await hash(
      signUpUserDto.password,
      bcryptConstants.saltRounds,
    );

    return this.usersService.send(
      { cmd: 'users_create' },
      { ...signUpUserDto, password },
    );
  }

  async validateUser(username: string, password: string): Promise<any> {
    const getUser = await firstValueFrom(
      this.usersService.send({ cmd: 'users_find_by_email' }, username),
    );

    if (!getUser) {
      return null;
    }

    const isValidPassword = await compare(password, getUser.password);

    if (!isValidPassword) {
      return null;
    }

    const { password: pswrd, ...result } = getUser;

    return result;
  }

  async login(user: any): Promise<any> {
    const { username, _id } = user;
    const payload = { username, sub: _id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
