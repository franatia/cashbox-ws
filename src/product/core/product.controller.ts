import { Controller, Post, Body, Put, Param, Delete, ParseUUIDPipe, Get, Query } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { Paths } from '../constants/paths';
import { CreateFeaturesDto } from '../features/dto/create-features.dto';
import { AccessPolicies } from '@/access/decorators/access.decorator';
import { ProjectMainPolicie } from '@/access/policies/project/main.policie';
import { RelationsConfig, RelationsRule } from '@/relations/decorators/relations.decorator';
import { ProductService } from './product.service';
import { CurrentProject } from '@/common/decorators/token.decorator';
import { UpdateDto } from './dto/update.dto';
import { StripUndefinedPipe } from '@/common/pipes/stripe-undefined.pipe';
import ProductSearch from './product.search';
import GetDto from './dto/get.dto';

@Controller('product')
@AccessPolicies(
  ProjectMainPolicie
)
export class ProductController {

  constructor(
    private readonly service: ProductService,
    private readonly search : ProductSearch
  ) { }

  @RelationsConfig({
    from : "groupId?",
    to : "context.projectId",
    rule : RelationsRule.PRODUCT_GROUP_TO_PROJECT
  })
  @Get()
  get(
    @Query(new StripUndefinedPipe()) dto : GetDto,
    @CurrentProject() projectId : string
  ){
    return this.search.get({
      ...dto,
      projectId
    });
  }

  @RelationsConfig(
    {
      from : Paths.PARAM_PRODUCT_ID,
      to : "context.projectId",
      rule : RelationsRule.PRODUCT_TO_PROJECT
    }
  )
  @Get(Paths.PARAM_PRODUCT)
  getById(
    @Param(Paths.PARAM_PRODUCT_ID) id : string
  ){
    return this.search.getById(id);
  }

  /**
   * 
   * POST
   * 
   */

  /**
   * 
   * @param dto 
   * @returns 
   */

  @Post()
  create(
    @Body() dto: CreateDto,
    @CurrentProject() projectId: string
  ) {
    return this.service.create(projectId, dto);
  }

  /**
   * 
   * PUT
   * 
   */

  @RelationsConfig(
    {
      from: Paths.PARAM_PRODUCT_ID,
      to: "context.projectId",
      rule: RelationsRule.PRODUCT_TO_PROJECT
    }
  )
  @Put(Paths.PARAM_PRODUCT)
  put(
    @Param(Paths.PARAM_PRODUCT_ID, new ParseUUIDPipe()) id: string,
    @Body(new StripUndefinedPipe()) dto: UpdateDto

  ) {
    return this.service.put(id, dto);
  }

  /**
   * 
   * DELETE
   * 
   */

  @RelationsConfig(
    {
      from: Paths.PARAM_PRODUCT_ID,
      to: "context.projectId",
      rule: RelationsRule.PRODUCT_TO_PROJECT
    }
  )
  @Delete(Paths.PARAM_PRODUCT)
  async delete(
    @Param(Paths.PARAM_PRODUCT_ID, new ParseUUIDPipe()) id : string
  ) {
    return this.service.delete(id)
  }

}
