import {
    Entity,
    Property,
    ManyToOne,
    Rel,
    OneToOne
} from '@mikro-orm/core'
import { BaseEntity } from '../../shared/db/baseEntity.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Alquiler } from '../alquiler/alquiler.entity.js'
import { Compra } from '../compra/compra.entity.js'

@Entity()
export class Calificacion extends BaseEntity {
    @Property({ nullable: false })
    fechaCalificacion!: Date 

    @Property({ nullable: false })
    valoracion!: number

    @Property({ nullable: true })
    comentario?: string

    @OneToOne(() => Alquiler, (alquiler) => alquiler.calificacion, {     
        nullable: true,
        unique: true,
        owner: true 
    })
    alquiler?: Rel<Alquiler>

    @OneToOne(() => Compra, (compra) => compra.calificacion, {     
        nullable: true,
        unique: true,
        owner: true 
    })
    compra?: Rel<Compra>

    @ManyToOne(() => Usuario, { nullable: false })
    usuario!: Rel<Usuario>

}