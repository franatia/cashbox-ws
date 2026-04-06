import { BadRequestException, ForbiddenException, GoneException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailToken, User } from './entities';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import EmailDto from './dto/send-email.dto';
import MailManager from '@/mail/managers/mail.manager';
import { buildAuthPayloadByUser, compareToken, generateEmailToken } from '@/common/helpers/token.helper';
import { generateHash, match } from '@/common/helpers/hash.helper';
import EmailTokenDto from './dto/auth-email.dto';
import { addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { json } from 'stream/consumers';
import { StringValue } from 'ms';
import { AuthStage } from '@/auth/enums/auth-stage.enum';
import LogInDto from './dto/log-in.dto';
import AuthDto from './dto/auth.dto';
import AuthEmailDto from './dto/auth-email.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    readonly userRepo: Repository<User>,

    @InjectRepository(EmailToken)
    private readonly emailTokenRepo: Repository<EmailToken>,

    private readonly mailManager: MailManager,
    private readonly jwtService: JwtService
  ) { }

  async findUser(payload: FindOptionsWhere<User>){
    return await this.userRepo.createQueryBuilder("user")
      .addSelect("user.password")
      .where(payload)
      .getOne();
  }

  async existsUser(id : string){
    return await this.userRepo.exists({
      where: {
        id
      }
    })
  }

  private async generateJwt(payload: object, expiresIn: StringValue): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn
    })
  }

  private async deleteEmailTokensByEmail(email: string) {
    await this.emailTokenRepo.delete({ email });
  }

  private async createEmailToken(email: string): Promise<{
    token: string,
    entity: EmailToken
  }> {

    await this.deleteEmailTokensByEmail(email);

    const token = generateEmailToken();

    const tokenHash = await generateHash(token);
    const expiresAt = addMinutes(new Date(), 10);

    const emailTokenDraft = this.emailTokenRepo.create({
      email,
      tokenHash,
      expiresAt
    })

    return {
      token,
      entity: await this.emailTokenRepo.save(emailTokenDraft)
    }
  }

  async sendEmailToken(email: string) {

    const { token } = await this.createEmailToken(email);

    await this.mailManager.sendEmailToken(
      email,
      token
    )

    return {
      send: true
    }

  }

  private async verifyEmailToken(email: string, token: string): Promise<boolean> {

    const emailToken = await this.emailTokenRepo.findOne({
      where: {
        email
      }
    })

    if (!emailToken) throw new GoneException("Token does not exists");

    if (emailToken.expiresAt < new Date()) {
      await this.deleteEmailTokensByEmail(email);
      throw new ForbiddenException("Token was expired");
    }

    const isValid = await compareToken(token, emailToken?.tokenHash)

    if (!isValid) throw new UnauthorizedException("Token is not valid");

    await this.deleteEmailTokensByEmail(email);

    return isValid;

  }

  async authEmail(authEmailDto: AuthEmailDto) {

    const { email, token } = authEmailDto;

    const isValid = await this.verifyEmailToken(email, token);

    const authEmailToken = await this.generateJwt({
      stage: AuthStage.authEmail,
      email,
      isValid: true
    }, "10m");

    return {
      authEmailToken,
      isValid
    };

  }

  async registerUser(email: string, password: string) {

    const passwordHash = await generateHash(password);

    const user = this.userRepo.create({
      email,
      password: passwordHash
    })

    const { id } = await this.userRepo.save(user);

    const accessToken = await this.generateJwt({
      sub: id,
      stage: AuthStage.access
    }, "1h");

    return {
      accessToken,
    };

  }

  async logIn(logInDto: LogInDto, user: User | null) {

    const { email, password } = logInDto;
    let userSnapshot = user ?? await this.findUser({
      email
    })

    const isMatch = await match(password, userSnapshot!.password)

    if (!isMatch) throw new BadRequestException("Password is not valid");

    const { isAuth, stage, expiresIn } = buildAuthPayloadByUser(user);

    const token = await this.generateJwt({
      sub: userSnapshot?.id,
      stage
    }, expiresIn);

    const payloadReturn = {
      token,
      isAuth
    }

    if (!isAuth){
      await this.sendEmailToken(userSnapshot!.email);
      payloadReturn["send"] = true;
    }

    return payloadReturn;
  }

  async auth(authDto: AuthDto, user: User) {

    const { token } = authDto;

    await this.verifyEmailToken(user.email, token);

    const { expiresIn, stage } = buildAuthPayloadByUser(user);

    const refreshToken = await this.generateJwt({
      sub: user.id,
      stage
    }, expiresIn)

    return {
      refreshToken
    };

  }
}
