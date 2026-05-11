import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { In } from "typeorm";
import { FeatureValue } from "../entities/feature-value.entity";
import { CreateDto } from "./dto/create.dto";
import { FeaturesService } from "../features/features.service";
import UpdateDto from "./dto/update.dto";import FeatureValuesQuery from "./feature-values.query";
import FeaturesQuery from "../features/features.query";

@Injectable()
export class FeatureValuesService {
    constructor(
        @Inject(forwardRef(() => FeaturesService))
        private readonly featureService: FeaturesService,
        private readonly query: FeatureValuesQuery,

        @Inject(forwardRef(() => FeaturesQuery))
        private readonly featuresQuery : FeaturesQuery
    ) {

    }

    /**
     * 
     * LINKERS
     * 
     */



    /**
     * 
     * @param valuesId 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async manyLinkedToProject(
        valuesId: string[],
        projectId: string,
        throwable: boolean = true
    ) {
        const count = await this.query
            .count({
                id: In(valuesId),
                feature: {
                    product: {
                        project: {
                            id: projectId
                        }
                    }
                }
            })

        const isExists = count === valuesId.length;

        if (!isExists && throwable) {
            throw new BadRequestException("Feature values are not linked with project");
        }

        return isExists;
    }

    /**
       * 
       * Verifica si los feature values dados estan vinculados
       * al feature dado.
       * 
       * @param featureValueIds 
       * @param featureId 
       */

    async linkedToFeature(
        featureValueId: string,
        featureId: string
    ) {

        const isExists = await this.query.exists({
            id: featureValueId,
            feature: {
                id: featureId
            }
        })

        if (!isExists) {
            throw new BadRequestException("All features are not linked with the product feature");
        }

    }

    /**
   * 
   * Verifica si los feature values dados estan vinculados
   * al feature dado.
   * 
   * @param featureValueIds 
   * @param featureId 
   */

    async manyLinkedToFeature(
        valuesId: string[],
        id: string
    ) {

        const count = await this.query.count({
            id: In(valuesId),
            feature: {
                id
            }
        })

        if (count < valuesId.length) {
            throw new BadRequestException(`All feature values are not linked with the feature with id '${id}'`);
        }

    }

    /**
       * 
       * Convierte los DTOs de características a metadatos de valores de características.
       * Es decir, pasa cada FeatureDTO a un tipo de dato util que nos permite
       * hacer el producto cartesiano y obtener todas las combinaciones posibles de
       * las caracteristicas
       * 
       * @param featuresDto 
       * @returns 
       */

    async manyLinkedToFeatures(
        features: {
            id: string,
            valuesId: string[]
        }[]
    ) {

        await Promise.all(
            features.map(({
                valuesId,
                id
            }) => this.manyLinkedToFeature(valuesId, id)
            )
        )

    }

    /**
   * 
   * Verifica si los feature values dados
   * estan vinculados al producto.
   * 
   * @param featureValueIds 
   * @param productId 
   */

    async linkedToProduct(
        featureValueId: string,
        productId: string,
    ) {

        const isExists = await this.query.exists({
            id: featureValueId,
            feature: {
                product: {
                    id: productId
                }
            }
        })

        if (!isExists) {
            throw new BadRequestException("All features are not linked with the product");
        }

    }

    /**
   * 
   * Verifica si los feature values dados
   * estan vinculados al producto.
   * 
   * @param featureValueIds 
   * @param productId 
   */

    async manyLinkedToProduct(
        ids: string[],
        productId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(ids),
            feature: {
                product: {
                    id: productId
                }
            }
        })

        const exists = count == ids.length;

        if (!exists && throwable) {
            throw new BadRequestException("All features are not linked with the product");
        }

        return exists;

    }

    /**
     * 
     * MAPPING
     * 
     */

    /**
         * 
         * Mapea los feature values segun el 
         * product feature id
         * 
         * @param featureValues 
         */

    mapByFeatureId(
        featureValues: FeatureValue[]
    ): Map<string, FeatureValue[]> {

        const map = new Map<string, FeatureValue[]>();

        for (const featureValue of featureValues) {

            const { feature } = featureValue;

            if (!feature) continue;

            const { id: featureId } = feature;

            if (!map.has(featureId)) {
                map.set(featureId, [])
            }

            map.get(featureId)?.push(featureValue)

        }

        return map;

    }
    
    /**
     * 
     * CREATORS
     * 
     */

    async create(
        dto: CreateDto
    ) {

        const {
            featureId
        } = dto;

        const featureValue = await this.query.saveOne(dto)

        await this.featuresQuery.addValues(
            featureId,
            [featureValue.id]
        )

        const featureContextChanges = await this.featureService.updateRelatedFeatureContexts(
            featureId
        )

        return {
            featureValue,
            featureContextChanges
        };

    }

    /**
     * 
     * GET
     * 
     */


    async getById(
        valueId: string
    ) {
        return this.query.findOneOrFail({
            where: {
                id: valueId
            },
            loadRelationIds: {
                relations: [
                    "feature"
                ]
            }
        })
    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param featureValueId 
     * @param dto 
     * @returns 
     */

    async put(
        featureValueId: string,
        dto: UpdateDto
    ) {

        if (!Object.entries(dto).length) return {};

        const newFeatureValue = await this.query.update(
            featureValueId,
            dto
        )

        return newFeatureValue;

    }

    /**
     * 
     * DELETE
     * 
     */

    async delete(
        valueId: string
    ) {

        return this.query.deleteById(valueId)

    }

}