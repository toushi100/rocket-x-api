import mongoose, { Schema,Model,Document } from 'mongoose';

export interface IClient extends Document{
    name: string;
    clientId: string;
    clientSecret: string;
}


const clientSchema = new Schema<IClient>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});


export interface IAccessToken extends Document{
    userId: string;
    token: string;
    created: Date;
    remove: any;
}
const accessTokenSchema = new Schema<IAccessToken>({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
        
    }
});


export interface IRefreshToken extends Document{
    userId: string;
    clientId: string;
    token: string;
    created: Date;
    remove: any;

}
const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

export const Client:Model<IClient> = mongoose.model('Client', clientSchema);
export const  AccessToken:Model<IAccessToken>  = mongoose.model('AccessToken', accessTokenSchema);
export const  RefreshToken:Model<IRefreshToken>  = mongoose.model('RefreshToken', refreshTokenSchema);


