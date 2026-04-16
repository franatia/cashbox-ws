import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import Configuration from './config/interfaces/configuration.interface';
import { Environment } from './config/interfaces/environment.enum';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProjectModule } from './projects/project.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PriceModule } from './price/price.module';
import { CashboxModule } from './cashbox/cashbox.module';
import { RuleModule } from './rule/rule.module';
import { CustomerModule } from './customer/customer.module';
import { StockModule } from './stock/stock.module';
import { DebtModule } from './debt/debt.module';
import { BillModule } from './bill/bill.module';
import { TaxModule } from './tax/tax.module';
import { PaymentModule } from './payment/payment.module';
import { CostsModule } from './costs/costs.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {

        const databaseConfig = config.get<Configuration["database"]>("database")!;
        const appConfig = config.get<Configuration["app"]>("app")!;

        const isDevelopment = appConfig.env === Environment.development;
        
        return ({
          type: 'postgres',

          ...databaseConfig,
          
          synchronize: isDevelopment,
          logging: isDevelopment,
          migrationsRun: !isDevelopment,
          autoLoadEntities: true
        })
      }
    }),

    AuthModule,
    UsersModule,
    MailModule,
    ProjectModule,
    ProductModule,
    OrderModule,
    PriceModule,
    CashboxModule,
    RuleModule,
    CustomerModule,
    StockModule,
    DebtModule,
    BillModule,
    TaxModule,
    PaymentModule,
    CostsModule,
    AccessModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
