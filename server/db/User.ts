import { model, Schema } from "mongoose";

import { Networks } from "../data/Networks";

export interface IUser {
    wallet: string;
    signature: string;
    settings: {
        asset: string;
        network: string;
        redirectURL: string;
        addFeeAsExtraPayment: boolean;
    };
    registrationDate: Date;
}

const userSchema = new Schema<IUser>({
    wallet: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    settings: new Schema(
        {
            asset: String,
            network: {
                type: String,
                enum: Networks,
            },
            redirectURL: String,
            addFeeAsExtraPayment: {
                type: Boolean,
                default: false,
            },
        },
        { _id: false }
    ),
    registrationDate: Date,
});

const UserModel = model("users", userSchema);
export default UserModel;
