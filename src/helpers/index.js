import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import phone from "phone";
import pkg from "mongoose";
import { addMinutes } from "./date.js";
const { Types } = pkg;

// cryptr encrypt
export function encrypt(data) {
    data = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(data, process.env.CRYPTR_CODE);
    return encrypted.toString();
}

//cryptr encrypt
export function decrypt(data) {
    const decryptedData = CryptoJS.AES.decrypt(data, process.env.CRYPTR_CODE);
    return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
}

//hash
export async function hash(param) {
    return await bcrypt.hash(param, 12);
}

//verify hash
export async function verifyHash(hashedPram, param) {
    return await bcrypt.compare(param, hashedPram);
}

export const generateToken = async (length = 6, minutes = 5) => {
    if (length <= 0) {
        length = 6;
    }

    if (minutes <= 0) {
        minutes = 5;
    }

    let token = Math.floor(10 ** (length - 1) + Math.random() * (10 ** (length - 1) * 9));
    const hashToken = await hash(token.toString());
    const tokenExpiry = addMinutes(new Date(), minutes);

    return {
        token,
        hashToken,
        tokenExpiry,
    };
};

export const convertToObjectId = id => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        return id;
    }
};

export const nilObjectId = () => {
    return new Types.ObjectId("000000000000000000000000");
};

export function headerConfig(auth, contentType = "application/json") {
    return {
        headers: {
            Authorization: `Bearer ${auth}`,
            "Content-type": contentType,
        },
    };
}

export const generateUniqueString = (length = 6) => {
    if (length <= 0) {
        length = 6;
    }

    return Math.floor(10 ** (length - 1) + Math.random() * (10 ** (length - 1) * 9));
};

export const deleteFields = (data, fields) => {
    fields.forEach(field => {
        Reflect.deleteProperty(data, field);
    });
};

export const convertToInternationalFormat = (phoneNumber, shortCode) => {
    // validate raw phone number
    let isPhoneValid = phone.phone(phoneNumber);
    if (isPhoneValid.isValid) {
        return isPhoneValid.phoneNumber;
    }

    // validate phone number with short code
    isPhoneValid = phone.phone(phoneNumber, {
        country: shortCode || "NG",
    });

    return isPhoneValid.isValid ? isPhoneValid.phoneNumber : phoneNumber;
};
