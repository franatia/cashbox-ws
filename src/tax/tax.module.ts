import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tax from './entities/tax.entity';
import CountryTaxProfile from './entities/country-tax-profile.entity';
import { TaxProfile } from './entities/tax-profile.entity';
import TaxController from './core/tax.controller';
import TaxService from './core/tax.service';
import { TaxQuery } from './core/tax.query';
import CountryTaxProfileQuery from './country-tax-profile/country-tax-profile.query';
import TaxProfileQuery from './tax-profile/tax-profile.query';
import TaxProfileService from './tax-profile/tax-profile.service';
import TaxSearch from './core/tax.search';
import { TaxSnapshot } from './entities/snapshot/snapshot.entity';
import { TaxItemSnapshot } from './entities/snapshot/snapshot-item.entity';
import { SnapshotService } from './snapshot/core/snapshot.service';
import { SnapshotQuery } from './snapshot/core/snapshot.query';
import { SnapshotInitializer } from './snapshot/core/snapshot.initializer';
import { ItemSnapshotQuery } from './snapshot/item/item-snapshot.query';
import { ItemSnapshotService } from './snapshot/item/item-snapshot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tax,
      CountryTaxProfile,
      TaxProfile,
      TaxSnapshot,
      TaxItemSnapshot
    ])
  ],
  controllers: [TaxController],
  providers: [
    TaxService,
    TaxQuery,
    TaxSearch,
    
    CountryTaxProfileQuery,

    TaxProfileQuery,
    TaxProfileService,

    SnapshotService,
    SnapshotQuery,
    SnapshotInitializer,

    ItemSnapshotQuery,
    ItemSnapshotService
  ],
  exports : [
    TaxService,
    TaxQuery,
    TaxSearch,
    
    CountryTaxProfileQuery,

    TaxProfileQuery,
    TaxProfileService,

    SnapshotService,

    ItemSnapshotService
  ]
})
export class TaxModule { }
