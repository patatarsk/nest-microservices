import { bcryptConstants } from './constants';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { recoveryConstants } from './constants';
import { SQS } from 'aws-sdk';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';

const { AWS_SQS_URL, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

@Injectable()
export class AppService {
  constructor(
    @Inject('SQS_SERVICE') private usersService: ClientProxy,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signUpUser(signUpUserDto: SignUpUserDto): Promise<any> {
    const { email } = signUpUserDto;

    const getUser = await lastValueFrom(
      this.usersService.send({ cmd: 'users_find_by_email' }, { email }),
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
    const getUser = await lastValueFrom(
      this.usersService.send(
        { cmd: 'users_find_by_email' },
        { email: username },
      ),
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

  async recoverPasswordRequest(username: string): Promise<any> {
    const getUser = await lastValueFrom(
      this.usersService.send(
        { cmd: 'users_find_by_email' },
        { email: username },
      ),
    );

    if (!getUser) {
      throw new BadRequestException('No such user');
    }

    const { linkToEndpoint, secret } = recoveryConstants;

    const hashSecret = await hash(secret, bcryptConstants.saltRounds);

    const generatedRecoveryLink = `${linkToEndpoint}${username}/?token=${hashSecret}`;

    await this.sendMessageToAwsSQS({
      email: username,
      link: generatedRecoveryLink,
    });
  }

  connectToSQS() {
    const sqs = new SQS({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    return sqs;
  }

  async sendMessageToAwsSQS(message) {
    const sqs = this.connectToSQS();

    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(message),
      QueueUrl: AWS_SQS_URL,
    };

    await sqs.sendMessage(params).promise();
  }

  async recoverPassword(email, token, password, confirm) {
    const getUser = await lastValueFrom(
      this.usersService.send({ cmd: 'users_find_by_email' }, { email }),
    );

    if (!getUser) {
      throw new BadRequestException('No such user');
    }

    const isValidToken = await compare(recoveryConstants.secret, token);

    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    if (password !== confirm) {
      throw new BadRequestException(
        'Password and confirm password should be equal',
      );
    }

    const newPassword = await hash(password, bcryptConstants.saltRounds);

    await this.usersService.emit(
      { cmd: 'users_update' },
      { id: getUser._id, updateUserDto: { ...getUser, password: newPassword } },
    );
  }
}
