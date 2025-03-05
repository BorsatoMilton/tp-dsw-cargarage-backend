import {
    Entity,
    Property,
    ManyToOne,
    Rel,
    OneToMany,
    Collection,
    OneToOne,
    Cascade
} from '@mikro-orm/core'
import { BaseEntity } from '../../shared/db/baseEntity.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Alquiler } from '../alquiler/alquiler.entity.js'
import { Marca } from '../marca/marca.entity.js'
import { Categoria } from '../categoria/categoria.entity.js'
import { Compra } from '../compra/compra.entity.js'

@Entity()
export class Vehiculo extends BaseEntity {
    
    @Property({ nullable: false })
    modelo!: string

    @Property({ nullable: false })
    descripcion!: string

    @Property({ type: 'date' })
    fechaAlta: Date = new Date();

    @Property({ type: 'date', nullable: true })
    fechaBaja?: Date

    @Property({ nullable: true, type: 'decimal' })
    precioVenta?: number

    @Property({ nullable: false})
    transmision!: string

    @Property({ nullable: true, type: 'decimal' })
    precioAlquilerDiario?: number

    @Property({ nullable: false, type: 'int'  })
    kilometros!: number

    @Property({ nullable: false, type: 'int'  })
    anio!: number

    @Property({ nullable: false, type: 'text' }) 
    imagenes!: string[];

    @OneToOne(() => Compra, (compra) => compra.vehiculo,{
     mappedBy: 'vehiculo', nullable: true, cascade: [Cascade.REMOVE]  
    }, )
    compra?: Rel<Compra> | null;

    @ManyToOne(() => Categoria , { nullable: false })
    categoria!: Rel<Categoria>

    @ManyToOne(() => Marca , { nullable: false })
    marca!: Rel<Marca>

    @ManyToOne(() => Usuario , { nullable: false })
    propietario!: Rel<Usuario>

    @OneToMany(()=> Alquiler , alquiler => alquiler.vehiculo, { nullable: true , cascade: [Cascade.REMOVE] })
    alquileres = new Collection<Alquiler>(this)
}