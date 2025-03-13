import {
  Entity,
  Property,
  ManyToMany,
  Collection,
  Cascade,
  OneToMany,
} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { Vehiculo } from "../vehiculo/vehiculo.entity.js";

@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false })
  nombreCategoria!: string;

  @Property({ nullable: false })
  descripcionCategoria!: string;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.categoria, {
    nullable: true,
    cascade: [Cascade.REMOVE],
  })
  vehiculos = new Collection<Vehiculo>(this);
}
