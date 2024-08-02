import { model, Schema } from "mongoose";

export interface IPayment {
    to: string;
    amount: number;
    asset?: string;
    network?: string;
    fee?: number;
    creationDate: Date;
    deadlineDate?: Date;
    status: "creating" | "pending" | "paid" | "partly-paid" | "timeout"
}

const paymentSchema = new Schema<IPayment>({
    to: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    asset: String,
    network: String,
    fee: Number,
    creationDate: {
        type: Date,
        require: true
    },
    deadlineDate: Date,
    status: {
        type: String,
        enum: ["creating", "pending", "paid", "partly-paid", "timeout"]
    }
});

const PaymentModel = model("payments", paymentSchema);
export default PaymentModel;
