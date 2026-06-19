export interface BaseService {
    
    create? (
       params : any 
    ) : any

    update? (
       ...args : any
    ) : any

    delete? (
       params : any 
    ) : any
}