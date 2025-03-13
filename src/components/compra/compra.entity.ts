import { Entity, Property, ManyToOne, Rel, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Vehiculo } from "../vehiculo/vehiculo.entity.js";
import { Calificacion } from "../calificacion/calificacion.entity.js";

@Entity()
export class Compra extends BaseEntity {
  @Property({ nullable: false })
  fechaCompra!: Date;

  @Property({ nullable: false })
  fechaLimiteConfirmacion!: Date;

  @Property({ nullable: true })
  fechaCancelacion!: Date;

  @Property({ nullable: false })
  estadoCompra!: string;

  @OneToOne(() => Calificacion, (calificacion) => calificacion.compra, {
    mappedBy: "compra",
    nullable: true,
  })
  calificacion?: Rel<Calificacion> | null;

  @OneToOne(() => Vehiculo, (vehiculo) => vehiculo.compra, {
    nullable: false,
    unique: true,
    owner: true,
  })
  vehiculo!: Rel<Vehiculo>;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>;
}
