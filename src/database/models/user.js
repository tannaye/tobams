import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
// import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            select: false,
        },
        deleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.plugin(paginate);
// userSchema.plugin(aggregatePaginate);

const User = mongoose.model("User", userSchema);

export default User;
