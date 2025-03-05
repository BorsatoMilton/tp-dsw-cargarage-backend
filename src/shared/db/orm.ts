import { MikroORM } from '@mikro-orm/core'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { MongoDriver } from '@mikro-orm/mongodb'
import dotenv from 'dotenv'
dotenv.config()

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'subastasBD',
  driver: MongoDriver,
  clientUrl: process.env.URL_MONGO_DB,
  highlighter: new MongoHighlighter(),
  debug: true,
  driverOptions: {
    tls: true,
    tlsAllowInvalidCertificates: false,
    authSource: 'admin',
  },
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()

  await generator.updateSchema()
}