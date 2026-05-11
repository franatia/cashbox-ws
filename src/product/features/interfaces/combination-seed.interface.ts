/**
 * 
 * Esta interface sirve como una unidad almacenable
 * de informacion de los features que se combinaran
 * para la creacion de los items del producto, ya que
 * son importantes para asignar las atribuciones dentro
 * de la entidad, por ejemplo el sku o slug.
 * 
 */
export interface CombinationSeed {
    id?: string,
    featureId?: string,
}