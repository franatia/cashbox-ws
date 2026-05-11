import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { Product } from '../entities/product.entity';
import { In } from 'typeorm';
import { UpdateDto } from './dto/update.dto';
import { buildSlug } from '@/common/helpers/slug.helper';
import ProductQuery from './product.query';



@Injectable()
export class ProductService {

  constructor(

    private readonly query: ProductQuery

  ) { }

  /**
   * 
   * LINKERS
   * 
   */

  /**
   * 
   * Verifica si el producto esta relacionado al proyecto
   * 
   * @param productId 
   * @param projectId 
   * @returns 
   */

  async linkedToProject(
    productId: string,
    projectId: string,
    throwable: boolean = true
  ) {

    const exists = await this.query.exists({
      id: productId,
      project: {
        id: projectId
      }
    })

    if (!exists && throwable) throw new BadRequestException("Product not correspond toward project");

    return exists;

  }

  /**
   * 
   * Verifica si los productos estan vinculados al proyecto
   * 
   * @param productIds 
   * @param projectId 
   * @param throwable 
   * @returns 
   */

  async manyLinkedToProject(
    productIds: string[],
    projectId: string,
    throwable: boolean = true
  ) {

    const count = await this.query.count({
      id: In(productIds),
      project: {
        id: projectId
      }
    });

    const isExists = count === productIds.length;

    if (!isExists && throwable) throw new BadRequestException("All products are not correspond toward project");

    return isExists;

  }

  /**
   * 
   * CREATORS
   * 
   */

  /**
   * 
   * Crea un product
   * 
   * @param createProductDto 
   * @param user 
   * @returns 
   */

  async create(
    projectId: string,
    dto: CreateDto
  ) {

    const slug = buildSlug(dto.name);

    const product = await this.query.saveOne({
      slug,
      projectId,
      ...dto
    });

    return product

  }

  /**
   * 
   * PUT
   * 
   */

  /**
   * 
   * @param productId 
   * @param UpdateDto 
   */

  async put(
    productId: string,
    dto: UpdateDto
  ): Promise<Product> {

    const product = await this.query.updateOne(
      productId,
      dto
    )

    return product;

  }

  /**
   * 
   * DELETE
   * 
   */

  async delete(
    productId: string
  ) {
    return this.query.deleteOne({
      id: productId
    });
  }

}
