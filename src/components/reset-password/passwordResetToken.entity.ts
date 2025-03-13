import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { Usuario } from "../usuario/usuario.entity.js";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";

@Entity()
export class PasswordResetToken extends BaseEntity {
  @Property({ unique: true })
  token!: string;

  @ManyToOne(() => Usuario)
  user!: Usuario;

  @Property()
  expiryDate!: Date;
}
