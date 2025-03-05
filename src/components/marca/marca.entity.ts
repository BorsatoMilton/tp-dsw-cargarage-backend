import {
    Entity,
    Property,
    Collection,
    OneToMany,
    Cascade
} from '@mikro-orm/core'
import { BaseEntity } from '../../shared/db/baseEntity.entity.js'
import { Vehiculo } from '../vehiculo/vehiculo.entity.js'

@Entity()

export class Marca extends BaseEntity{

    @Property({ nullable: false })
    nombreMarca!: string

    @OneToMany(()=> Vehiculo, vehiculo => vehiculo.marca, { nullable: true, cascade: [Cascade.REMOVE]   })
    vehiculos = new Collection<Vehiculo>(this)

}