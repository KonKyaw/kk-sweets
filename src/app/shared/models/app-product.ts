import { MainAllergensEnum } from "shared/constants";

export interface AppProduct {
    key?: string,
    order: number,
    titleEn: string,
    titleMm: string,
    titleJa: string,
    descriptionEn: string,
    descriptionMm: string,
    descriptionJa: string,
    price?: number,
    category: string,
    allergenInfo?: MainAllergensEnum[]; // | SubAllergensEnum[]
    dataUrl?: string,
    downloadUrl?: string,
    note?: string,
    createdDate?: Date,
    updatedDate?: Date,
    createdUser?: string,
    updatedUser?: string,
}