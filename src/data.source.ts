import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: (process.env.POSTGRES_PORT as unknown) as number,
    username: 'ahmed',
    password: "Adham85m",
    database: "rocket_x_api_development",
    entities: ["dist/entities/*.entity.js"],
    migrations: ["dist/migrations/*.js"],
    synchronize: false,
    logging: true,  
   
}
const dataSource = new DataSource(dataSourceOptions)
export default dataSource