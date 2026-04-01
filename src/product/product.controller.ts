import { Controller, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Paths } from './constants/paths';
import CreateProductItemsDto from './dto/create-product-items.dto';
import { CreateFeaturesDto } from './dto/create-features.dto';
import CreateProductItemGroupDto from './dto/create-product-item-group.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user : string) {
    return this.productService.createProduct(createProductDto, user);
  }

  @Post(Paths.ITEMS)
  createProductItems(
    @Body() createProductItemsDto : CreateProductItemsDto,
    @CurrentUser() user : string
  ){

    return this.productService.createProductItems(
      createProductItemsDto,
      user
    )

  }

  @Post(Paths.FEATURES)
  createFeatures(
    @Body() createFeaturesDto: CreateFeaturesDto,
    @CurrentUser() user : string,
  ){

    return this.productService.createFeatures(
      createFeaturesDto,
      user
    )

  }

  @Post(Paths.ITEM_GROUP)
  createProductItemGroup(
    @Body() createProductItemGroupDto: CreateProductItemGroupDto,
    @CurrentUser() user: string
  ){

    return this.productService.createProductItemGroup(
      createProductItemGroupDto,
      user
    )

  }

}
