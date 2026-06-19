import { Injectable } from '@nestjs/common';
import {BaseService} from '@/common/models/crud/base-service.crud';
import { CreateParams, UpdateParams } from './types/params/service.param';
import { ProjectInitializer } from './project.initializer';
import { ProjectUpdater } from './query/project.updater';
import { ProjectDeleter } from './query/project.deleter';

@Injectable()
export class ProjectService implements BaseService {

  constructor(

    private readonly initializer: ProjectInitializer,

    private readonly updater: ProjectUpdater,
    private readonly deleter : ProjectDeleter

  ) { }

  /**
   * 
   * CREATE
   * 
   */

  /**
   * 
   * @param params 
   * @returns 
   */

  async create(
    params: CreateParams
  ) {

    return this.initializer.initialize(params);

  }

  /**
   * 
   * UPDATE
   * 
   */

  /**
   * 
   * @param id 
   * @param params 
   * @returns 
   */

  async update(
    id: string,
    params: UpdateParams
  ) {

    return this.updater.updateById(
      id,
      params
    )

  }

  /**
   * 
   * DELETE
   * 
   */

  /**
   * 
   * @param id 
   * @returns 
   */

  async delete(
    id : string
  ) {

    return this.deleter.deleteById(
      id
    );

  }


}
