import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { FeatureDto } from "./dto/feature.dto";
import {In } from "typeorm";
import { FeatureValue } from "../entities/feature-value.entity";
import {FeatureValuesService } from "../feature-values/feature-values.service";
import { CreateFeaturesDto } from "./dto/create-features.dto";
import UpdateDto from "./dto/update.dto";
import { FeatureGroupService } from "../feature-group/feature-group.service";
import FeatureGroupItem from "../entities/feature-group-item.entity";
import { ContextFeatureDto } from "../feature-group/dto/context-feature.dto";
import { CombinationSeed } from "./interfaces/combination-seed.interface";
import FeaturesQuery from "./features.query";
import { FeatureWithContext } from "./interfaces/feature-with-context.interface";
import FeatureValuesQuery from "../feature-values/feature-values.query";

@Injectable()
export class FeaturesService {
    constructor(

        @Inject(forwardRef(() => FeatureValuesService))
        private readonly valueService: FeatureValuesService,
        private readonly query: FeaturesQuery,

        private readonly valuesQuery: FeatureValuesQuery,

        @Inject(forwardRef(() => FeatureGroupService))
        private readonly groupService: FeatureGroupService

    ) { }

    /**
     * 
     * LINKERS
     * 
     */

    /**
     * 
     * @param featureId 
     * @param projectId 
     * @param throwable 
     * @returns 
     */

    async linkedToProject(
        featureId: string,
        projectId: string,
        throwable: boolean = true
    ) {
        const exists = await this.query.exists({
            id: featureId,
            product: {
                project: {
                    id: projectId
                }
            }
        })

        if (!exists && throwable) {
            throw new BadRequestException("Product feature is not linked with Project");
        }

        return exists;

    }

    /**
   *
   * Verifica si las caracteristicas estan relacionadas
   * al producto
   *  
   * @param featureIds 
   * @param productId 
   */

    async linkedToProduct(
        featureIds: string[],
        productId: string,
        throwable: boolean = true
    ) {

        const count = await this.query.count({
            id: In(featureIds),
            product: {
                id: productId
            }
        });

        const exists = count == featureIds.length;

        if (!exists && throwable) throw new BadRequestException("All features are not linked with the product");

        return exists;

    }

    /**
   * 
   * Verifica si los product features
   * estan vinculados al product feature group
   * 
   * @param featureIds 
   * @param featureGroupId 
   * @param throwable 
   * @returns 
   */

    async manyLinkedToGroup(
        ids: string[],
        groupId: string,
        throwable: boolean = true
    ) {

        const exists = await this.groupService.includeFeatures(ids, groupId)

        if (!exists && throwable) {
            throw new BadRequestException("Product features are not linked with product feature group")
        }

        return exists;

    }

    /**
     * 
     * Verifica si los product features
     * estan vinculados al product feature group
     * 
     * @param featureIds 
     * @param featureGroupId 
     * @param throwable 
     * @returns 
     */

    async linkedToGroup(
        id: string,
        groupId: string,
        throwable: boolean = true
    ) {

        const isExists = await this.groupService.includeFeatures([id], groupId)

        if (!isExists && throwable) {
            throw new BadRequestException("Product features are not linked with product feature group")
        }

        return isExists;

    }


    /**
     * 
     * VALIDATORS
     * 
     */

    /**
       * 
       * Valida la consistencia interna
       * de todos los features para que
       * se realice un correcto procesamiento de
       * los datos
       * 
       * @param features 
       */

    async validateFeaturesDto(
        features: ContextFeatureDto[]
    ) {

        await this.validateCombinationLimit(features);
        this.validateMainFeature(features);
        this.validateFeaturesLevel(features);

    }

    /**
       * 
       * Validar consistencia entre los feature values id dados
       * y el product feature id, es decir si estan vinculados
       * 
       * @param features 
       */

    async validateConsistence(
        features: FeatureDto[]
    ) {

        const featureValuesIdByFeatureId = this.mapValuesIdById(
            features
        )

        const featureParam = features.map(({ id }) => ({
            id,
            valuesId: featureValuesIdByFeatureId.get(id)!
        }))

        await this.valueService.manyLinkedToFeatures(
            featureParam
        )

    }

    /**
       * 
       * Valida que la cantidad de features no exceda
       * el limite de combinaciones
       * 
       * @param features 
       */

    async validateCombinationLimit(
        features: ContextFeatureDto[]
    ) {

        const valuesCount = await Promise.all(
            features.map(feature => (
                this.countValuesById(feature.id)
            ))
        )

        let totalCombinations = 1;

        // Verificamos tope de combinaciones
        valuesCount.forEach(count => {
            totalCombinations *= count;

            if (totalCombinations > 100) {
                throw new BadRequestException("Your petition exceeds the combination limit (100 combinations)");
            }

        });

    }

    /**
     * 
     * Valida si los niveles de los features
     * son validos y estan ordenados.
     * 
     * @param features 
     */

    validateFeaturesLevel(
        features: (Partial<FeatureDto> & { level: number })[]
    ) {

        const featuresSorted = [...features].sort((a, b) => a.level - b.level);

        featuresSorted.forEach((feature, index) => {
            if (feature.level !== index + 1) {
                throw new BadRequestException("Feature levels are inconsistent");
            }
        });

    }

    /**
    * 
    * Valida que no exista mas de un main feature,
    * ya que a partir de el se crean los product
    * item groups
    * 
    * @param features 
    */

    validateMainFeature(
        features: Partial<FeatureDto>[]
    ) {
        const mainFeatures = features.filter(f => f.main);

        if (mainFeatures.length > 1) {
            throw new BadRequestException("Just need one feature with main porperty");
        } else if (mainFeatures.length < 1) {
            throw new BadRequestException("Main feature is required");
        }
    }

    /**
     * 
     * MAPPING
     * 
     */


    /**
     * 
     * Mapea los feaute values id de cada 
     * feature dto, con su respectivo
     * feature id como key de acceso
     * 
     * @param features 
     * @returns 
     */

    mapValuesIdById(
        features: FeatureDto[]
    ): Map<string, string[]> {

        const map = new Map<string, string[]>();

        for (const { id: featureId, values } of features) {
            for (const { id: valueId } of values) {

                if (!map.has(featureId)) {
                    map.set(featureId, []);
                }

                map.get(featureId)?.push(valueId);

            }
        }

        return map;

    }

    /**
     * 
     * Mapea los features dto segun
     * el feature id que contienen
     * 
     * @param features 
     * @returns 
     */

    mapDtoById(
        features: FeatureDto[]
    ): Map<string, FeatureDto> {

        const map = new Map<string, FeatureDto>();

        features.forEach(feature => map.set(feature.id, feature));

        return map;

    }

    /**
     * 
     * BUILDERS
     * 
     */

    /**
     * 
     * Combina las caracteristicas para obtener todas las combinaciones posibles entre ellas.
     * 
     * @param features 
     * @returns 
     */

    async buildCombinations(features: FeatureDto[]) {

        const combinations = await this.prepareAndBuildCombinationsSeed(features);

        return combinations.reduce<CombinationSeed[][]>(
            (acc, featureValues) =>
                acc.flatMap(accValues =>
                    featureValues.map(value => [...accValues, value])
                ),
            [[]]
        );
    }

    /**
     * 
     * Agrupa los feature values de los features
     * en un array cuyos valores estan un un formato
     * apto para que tras su combinacion sen consumidos.
     * Cada elemento de dicho array es otro array, cuyos
     * elementos pertenecen al mismo feature
     * 
     * @param featuresDto 
     * @returns 
     */

    async prepareAndBuildCombinationsSeed(
        featuresDto: FeatureDto[]
    ): Promise<CombinationSeed[][]> {

        const featureValuesId = this.getValuesIdFromDto(featuresDto);

        const featureValues = await this.valuesQuery.findMany({
            where: {
                id: In(featureValuesId)
            },
            relations: {
                feature: true
            }
        });

        const mapFeaturesDto = this.mapDtoById(featuresDto);

        return this.buildCombinationSeed(
            featureValues,
            mapFeaturesDto
        )

    }

    /**
     * 
     * @param featureValues 
     * @param mapFeaturesDto 
     * @returns 
     */

    buildCombinationSeed(
        featureValues : FeatureValue[],
        mapFeaturesDto : Map<string, FeatureDto>
    ) {
        const featureCombinationsByLevel: CombinationSeed[][] = [];

        featureValues.forEach(({ feature: productFeature, ...featureValue }) => {

            const featureDto = mapFeaturesDto.get(productFeature.id);

            if (!featureDto) {
                throw new Error(`FeatureDto not found for feature ${productFeature.id}`);
            }

            const index = featureDto.level - 1;

            const featureValueMetadata = {
                featureId: productFeature.id,
                featureName: productFeature.name,
                id: featureValue.id,
                value: featureValue.value
            };

            (featureCombinationsByLevel[index] ??= []).push(featureValueMetadata);

        })

        return featureCombinationsByLevel;
    }

    /**
     * 
     * Construye los features dto a partir de los
     * features context
     * 
     * @param features 
     * @returns 
     */

    buildContextFeatureDto(
        features: FeatureWithContext[]
    ) {

        return features.map<ContextFeatureDto>(({ productFeature: feature, dto }) => {
            const { level = 0, main } = dto;

            return {
                id: feature.id,
                level,
                main
            }
        })

    }

    /**
     * 
     * @param groupItems 
     */

    buildDtoByGroupItems(
        groupItems: FeatureGroupItem[]
    ): FeatureDto[] {

        const dto: FeatureDto[] = [];

        for (const item of groupItems) {

            const {
                feature,
                level,
                main
            } = item;

            const {
                id: featureId,
                values
            } = feature;

            if (!feature) {
                throw new BadRequestException("Feature entity is required");
            }

            if (!values?.length) {
                throw new BadRequestException("Feature value entities are required");
            }

            dto.push({
                id: featureId,
                level,
                main,
                values: values.map(({ id }) => ({ id }))
            })

        }

        return dto;

    }

    /**
     * 
     * HELPERS
     * 
     */

    /**
     * 
     * @param combination 
     * @returns 
     */

    getValuesIdByCombination(
        combination: CombinationSeed[]
    ) {
        return combination
            .filter(f => f.id !== undefined)
            .map(f => f.id as string);
    }

    getValuesIdFromDto(
        featuresDto: FeatureDto[]
    ) {
        return featuresDto.flatMap(dto => {
            return dto.values.map(({ id }) => id);
        })
    }

    /**
     * 
     * Cuenta cuantos feature values
     * tiene el feature
     * 
     * @param featureId 
     */

    async countValuesById(
        featureId: string
    ) {
        return this.valuesQuery.count({
            feature: {
                id: featureId
            }
        })
    }

    /**
     * 
     * UPDATE
     * 
     */

    updateRelatedFeatureContexts(
        featureId: string
    ) {
        return this.query.updateRelatedFeatureContexts(
            featureId
        )
    }

    /**
     * 
     * CREATORS
     * 
     */

    /**
     * 
     * @param productId 
     * @param features 
     */

    async createFeatureContext(
        productId: string,
        features: ContextFeatureDto[]
    ) {

        return this.groupService.create({
            productId,
            features,
            createFeatureContext: true
        })

    }

    /**
     * 
     * @param dto 
     * @returns 
     */

    async create(
        dto: CreateFeaturesDto
    ) {

        const {
            features: createFeaturesDto,
            productId,
            createFeatureContext
        } = dto;

        const contextFeatures = await this.query.prepareAndSaveMany(
            productId,
            createFeaturesDto
        )

        const featureEntities = contextFeatures.map(({ productFeature }) => productFeature);

        const basicPayload = {
            features: featureEntities
        }

        if (!createFeatureContext) return basicPayload;

        const contextFeaturesDto = this.buildContextFeatureDto(contextFeatures);

        const featureContext = await this.createFeatureContext(
            productId,
            contextFeaturesDto
        )

        return {
            ...basicPayload,
            featureContext
        }

    }

    /**
     * 
     * TODO: Se puede segmentar el createFeatures en:
     * 1. createFeatures
     * 2. createFeaturesWithProductItems
     * 
     */

    /**
     * 
     * GET
     * 
     */

    /**
     * 
     * @param featureId 
     * @param projectId 
     * @returns 
     */

    async getById(
        featureId: string,
        projectId: string
    ) {
        return this.query.findOneOrError({
            where: {
                id: featureId,
                product: {
                    project: {
                        id: projectId
                    }
                }
            },
            relations: {
                values: true
            },
            loadRelationIds: {
                relations: ["product"]
            }
        });
    }

    /**
     * 
     * PUT
     * 
     */

    /**
     * 
     * @param featureId 
     * @param dto 
     * @returns 
     */

    async put(
        featureId: string,
        dto: UpdateDto
    ) {

        if (!Object.entries(dto).length) return ({});

        const newFeature = await this.query.updateOne(
            featureId,
            dto
        )

        return newFeature;

    }

    /**
     * 
     * DELETE
     * 
     */

    async delete(
        featureId: string
    ) {
        return this.query.deleteById(featureId)
    }

}