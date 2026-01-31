import { Model, DataTypes, Sequelize, ModelAttributes } from "sequelize"
import type {
    InitOptions,
    InferAttributes,
    CreationOptional,
    InferCreationAttributes,
} from "sequelize"

//

class Api extends Model<InferAttributes<Api>, InferCreationAttributes<Api>> {
    declare id: CreationOptional<number>
    declare url: string
    declare hash: string
    declare online: CreationOptional<boolean>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

//

const apiAttributes: ModelAttributes<Api, InferAttributes<Api>> = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: "url",
    },
    hash: {
        type: DataTypes.STRING(512),
        allowNull: false,
    },
    online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}

//

const apiOptions = (sequelize: Sequelize): InitOptions<Api> => ({
    sequelize,
    tableName: "apis",
    timestamps: true,
})

//

export { Api, apiAttributes, apiOptions }
