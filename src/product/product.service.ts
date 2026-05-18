import { BadRequestException, ConsoleLogger, GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProjectService } from '@/projects/project.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductUnitType } from './entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import CreateProductItemsDto from './dto/create-product-items.dto';
import CreateFeatureDto from './dto/create-feature.dto';
import { ProductFeature } from './entities/product-feature.entity';
import { FeatureValue } from './entities/feature-value.entity';
import { ProductItem } from './entities/product-item.entity';
import { FeatureDto } from './dto/feature.dto';
import { CreateFeaturesDto } from './dto/create-features.dto';
import CreateProductItemGroupDto from './dto/create-product-item-group.dto';
import { ProductItemGroup } from './entities/product-item-group.entity';
import { Stock } from '@/stock/entities/stock.entity';
import { Node } from '@/projects/entities/node.entity';

interface FeatureValueMetadata {
  id: string,
  featureId: string,
  featureName: string,
  value: string
}

@Injectable()
export class ProductService {

  constructor(

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductItem)
    private readonly productItemRepo: Repository<ProductItem>,

    @InjectRepository(ProductItemGroup)
    private readonly productItemGroupRepo: Repository<ProductItemGroup>,

    @InjectRepository(ProductFeature)
    private readonly productFeatureRepo: Repository<ProductFeature>,

    @InjectRepository(FeatureValue)
    private readonly featureValueRepo: Repository<FeatureValue>,

    private readonly projectService: ProjectService,

    private readonly dataSource: DataSource

  ) { }

  /* ============== VERIFY ============== */

  async productLinkedToProject(
    productId: string,
    projectId: string
  ): Promise<Product> {

    const product = await this.productRepo.findOne({
      where: {
        id: productId,
        project: {
          id: projectId
        }
      }
    })

    if (!product) throw new BadRequestException("Product not correspond toward project");

    return product;

  }

  async productItemsLinkedToProduct(
    itemIds: string[],
    productId: string
  ) {

    const count = await this.productItemRepo.count({
      where: {
        id: In(itemIds),
        product: {
          id: productId
        }
      }
    })

    if (count < itemIds.length) {
      throw new BadRequestException("All product items are not linked with the product");
    }

  }

  async featuresLinkedToProduct(
    featureIds: string[],
    productId: string
  ) {

    const count = await this.productFeatureRepo.count({
      where: {
        id: In(featureIds),
        product: {
          id: productId
        }
      }
    });

    if (count < featureIds.length) throw new BadRequestException("All features are not linked with the product");

  }

  async featureValuesLinkedToProduct(
    featureValueIds: string[],
    productId: string,
  ) {

    const count = await this.featureValueRepo.count({
      where: {
        id: In(featureValueIds),
        productFeature: {
          product: {
            id: productId
          }
        }
      }
    })

    if (count < featureValueIds.length) {
      throw new BadRequestException("All features are not linked with the product");
    }

  }

  async featureValuesLinkedToFeature(
    featureValueIds: string[],
    featureId: string
  ) {

    const count = await this.featureValueRepo.count({
      where: {
        id: In(featureValueIds),
        productFeature: {
          id: featureId
        }
      }
    })

    if (count < featureValueIds.length) {
      throw new BadRequestException("All features are not linked with the product feature");
    }

  }

  /* ============== UTILS ============== */

  combineFeatureMetadata(features: FeatureValueMetadata[][]) {
    return features.reduce<FeatureValueMetadata[][]>(
      (acc, featureValues) =>
        acc.flatMap(accValues =>
          featureValues.map(value => [...accValues, value])
        ),
      [[]]
    );
  }

  async convertFeatureDtoToMetadata(featuresDto: FeatureDto[]): Promise<FeatureValueMetadata[][]> {

    const valueIds = featuresDto.flatMap(f => f.values.flatMap(value => value.id));

    const featureValues = await this.featureValueRepo.find({
      where: {
        id: In(valueIds),
      },
      relations: {
        productFeature: true
      }
    });

    if (featureValues.length < valueIds.length) throw new BadRequestException("Feature Values are wrong");

    const featuresSorted = [...featuresDto].sort((a, b) => a.level - b.level);

    featuresSorted.forEach((feature, index) => {
      if (feature.level !== index + 1) {
        throw new BadRequestException("Feature levels are inconsistent");
      }
    });

    const mapFeaturesDto = new Map<string, FeatureDto>();
    featuresSorted.forEach(feature => mapFeaturesDto.set(feature.id, feature));

    const metadata: FeatureValueMetadata[][] = [];

    featureValues.forEach(({ productFeature, ...featureValue }) => {

      const featureDto = mapFeaturesDto.get(productFeature.id);
      const valueDtoIds = featureDto?.values.map(value => value.id);

      if (
        featureDto === undefined ||
        !valueDtoIds?.includes(featureValue.id)
      ) throw new BadRequestException("Relations between product features and feature values are inconsistent");

      const index = featureDto.level - 1;

      if (!metadata[index]) {
        metadata[index] = [];
      }

      metadata[index].push({
        featureId: productFeature.id,
        featureName: productFeature.name,
        id: featureValue.id,
        value: featureValue.value
      })

    })

    return metadata;

  }

  createProductItemSku(
    productSlug: string,
    featureValues: FeatureValueMetadata[]
  ) {

    const metadataSku = featureValues.map(meta => `${meta.featureName}:${meta.value}`).join("-");

    return `${productSlug}-${metadataSku}`.toUpperCase();

  }

  /* ============== CREATE ============== */

  async createProduct(createProductDto: CreateProductDto, user: string) {

    const { projectId, ...payload } = createProductDto;

    //await this.projectService.hasProjectAdminAccess(projectId, user);

    const slug = createProductDto.name.toLowerCase().replace(/\s+/g, "-");

    return await this.dataSource.transaction(async (manager) => {
      const productDraft = manager.create(Product, {
        ...payload,
        project: {
          id: projectId
        },
        unit: ProductUnitType.UNIT,
        slug
      });

      const savedProduct = await manager.save(Product, productDraft);

      // Check if SKU already exists in database to prevent unique constraint failures
      let sku = `${slug.toUpperCase()}-STANDARD`;
      const skuExists = await manager.findOne(ProductItem, { where: { sku } });
      if (skuExists) {
        sku = `${slug.toUpperCase()}-${Date.now().toString().slice(-4)}`;
      }

      const defaultItem = manager.create(ProductItem, {
        product: { id: savedProduct.id },
        sku,
        featureValues: []
      });
      const savedItem = await manager.save(ProductItem, defaultItem);

      // Fetch the default branch warehouse node for this project
      const defaultNode = await manager.findOne(Node, {
        where: { project: { id: projectId } }
      });

      if (defaultNode) {
        const stock = manager.create(Stock, {
          productItem: { id: savedItem.id },
          node: { id: defaultNode.id },
          project: { id: projectId },
          quantity: 0,
          totalAmount: 0
        });
        await manager.save(Stock, stock);
      }

      return {
        id: savedProduct.id
      };
    });

  }

  async createProductItems(
    createProductItems: CreateProductItemsDto,
    user: string
  ) {
    const { projectId, productId, features } = createProductItems;

    //await this.projectService.hasProjectMainAccess(projectId, user);

    let totalCombinations = 1;

    features.forEach(feature => {
      totalCombinations *= feature.values.length;

      if (totalCombinations > 100) {
        throw new BadRequestException("Your petition exceeds the combination limit (100 combinations)");
      }

    });

    await this.featuresLinkedToProduct(
      features.map(feature => feature.id),
      productId
    )

    const { slug } = await this.productLinkedToProject(productId, projectId);


    const combinedFeatures = this.combineFeatureMetadata(
      await this.convertFeatureDtoToMetadata(features)
    )

    const ids = await this.dataSource.transaction(async manager => {

      let payload = combinedFeatures.map(features => {

        const sku = this.createProductItemSku(slug, features);

        return {
          product: {
            id: productId
          },
          featureValues: features.map(f => ({ id: f.id })),
          sku
        }

      })

      const items = await manager.save(
        ProductItem,
        payload
      )

      return items.map(i => i.id);

    })

    return {
      ids
    }

  }

  async createFeatures(
    { features, projectId, productId }: CreateFeaturesDto,
    user: string,
  ) {

    //await this..hasProjectAdminAccess(projectId, user);

    await this.productLinkedToProject(productId, projectId);

    await this.dataSource.transaction(async manager => {


      for (const { values, schema, ...feature } of features) {

        const { id: featureId } = await manager.save(
          ProductFeature,
          {
            ...feature,
            ...(schema && { schema: { id: schema } }),
            product: {
              id: productId
            }
          }
        );

        for (const value of values) {

          await manager.save(
            FeatureValue,
            {
              value,
              productFeature: {
                id: featureId
              }
            }
          )

        }

      }
    });

  }

  private async getProductItemIdsByFeatureValues(
    featureValueIds: string[],
    productId: string,
  ): Promise<string[]> {

    const qb = this.productItemRepo
      .createQueryBuilder("item")
      .select("item.id", "id")
      .where("item.productId = :productId", { productId });

    const setFeatureValueIds = [...new Set(featureValueIds)];

    for (let i = 0; i < setFeatureValueIds.length; i++) {

      const fvId = setFeatureValueIds[i];
      qb.andWhere(`
          EXISTS (
            SELECT 1
            FROM main."product-items_feature_values_feature-values" pifv
            WHERE pifv."productItemsId" = item.id
            AND pifv."featureValuesId" = :fv${i}
          )
        `, { [`fv${i}`]: fvId });

    }

    const rows = await qb.getRawMany<{ id: string }>();

    return rows.map(item => item.id);

  }

  private async saveProductItemGroup(

    payload: {
      name: string | null,
      basePrice: number | null,
      webVisibility: boolean
    },
    productId : string,
    featureValueIds: string[] = [],
    itemIds: string[] = []

  ) {

    const { id } = await this.productItemGroupRepo.save({
      ...payload,
      product: {
        id: productId
      },
      productItems: itemIds.map(id => ({ id })),
      featureValues: featureValueIds.map(id => ({ id }))
    })

    return { id };

  }

  async createProductItemGroup(

    createItemGroupDto: CreateProductItemGroupDto,
    user: string

  ) {

    let {
      projectId,
      productId,
      productItemIds,
      featureValueIds,
      basedOnFeatures,
      ...payload
    } = createItemGroupDto;

    //await this.projectService.hasProjectAdminAccess(projectId, user);

    await this.productLinkedToProject(productId, projectId);

    if (basedOnFeatures) {

      if (!featureValueIds?.length) {
        throw new BadRequestException("Feature values are illegal");
      }

      productItemIds = await this.getProductItemIdsByFeatureValues(
        featureValueIds,
        productId
      );

      if (!productItemIds.length) {
        throw new BadRequestException("There are no product items with these features");
      }

    }

    if(!productItemIds?.length){
      throw new BadRequestException("Product items are illegal");
    }

    return this.saveProductItemGroup(
      payload,
      productId,
      featureValueIds || [],
      productItemIds || []
    )
  }

  async findAllByProject(projectId: string) {
    // 1. Fetch products without items.stock relation to bypass TypeORM JoinColumn bug
    const products = await this.productRepo.find({
      where: { project: { id: projectId } },
      relations: ['brand', 'groups', 'items', 'items.featureValues'],
    });

    // 2. Fetch all stocks for this project
    const stocks = await this.dataSource.getRepository(Stock).find({
      where: { project: { id: projectId } },
      relations: ['productItem'],
    });

    // 3. Map stock quantities by productItem.id
    const stockMap = new Map<string, number>();
    stocks.forEach(s => {
      if (s.productItem) {
        stockMap.set(s.productItem.id, s.quantity);
      }
    });

    return products.map(product => {
      let totalStock = 0;
      let variantCount = product.items?.length || 0;
      
      product.items?.forEach(item => {
        const qty = stockMap.get(item.id) || 0;
        totalStock += qty;
      });

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        subtractType: product.subtractType,
        totalStock,
        variantCount,
        groupNames: product.groups?.map(g => g.slug) || [],
        brandName: product.brand ? product.brand.name : null,
        defaultItemId: product.items?.[0]?.id || null,
      };
    });
  }

  async findOneDetail(id: string, nodeId?: string) {
    // 1. Fetch product details
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'project',
        'brand',
        'groups',
        'features',
        'features.values',
        'items',
        'items.featureValues',
      ],
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    // 2. Fetch stocks for the product items (with lazy initialization if nodeId is specified)
    const itemIds = product.items?.map(item => item.id) || [];
    let stocks: Stock[] = [];
    if (itemIds.length > 0) {
      const stockRepo = this.dataSource.getRepository(Stock);
      if (nodeId) {
        for (const itemId of itemIds) {
          let stock = await stockRepo.findOne({
            where: { node: { id: nodeId }, productItem: { id: itemId } },
            relations: ['productItem', 'node']
          });
          if (!stock) {
            stock = stockRepo.create({
              productItem: { id: itemId },
              node: { id: nodeId },
              project: { id: product.project.id },
              quantity: 0,
              totalAmount: 0
            });
            stock = await stockRepo.save(stock);
          }
          stocks.push(stock);
        }
      } else {
        stocks = await stockRepo.find({
          where: { productItem: { id: In(itemIds) } },
          relations: ['productItem', 'node'],
        });
      }
    }

    // 3. Map stocks by productItem.id
    const stockMap = new Map<string, Stock>();
    stocks.forEach(s => {
      if (s.productItem) {
        stockMap.set(s.productItem.id, s);
      }
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      slug: product.slug,
      subtractType: product.subtractType,
      webVisibility: product.webVisibility,
      basePrice: product.basePrice,
      brand: product.brand ? { id: product.brand.id, name: product.brand.name } : undefined,
      groups: product.groups || [],
      features: product.features || [],
      items: product.items?.map(item => {
        const itemStock = stockMap.get(item.id);
        return {
          id: item.id,
          sku: item.sku,
          webVisibility: item.webVisibility,
          featureValues: item.featureValues || [],
          stock: itemStock ? {
            id: itemStock.id,
            quantity: itemStock.quantity,
            totalAmount: itemStock.totalAmount,
            nodeId: itemStock.node?.id || '',
          } : undefined,
        };
      }) || [],
    };
  }

}

