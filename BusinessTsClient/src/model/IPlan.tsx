import { IPlanTranslation } from "./IPlanTranslation";

export interface IPlan {
    id: number;
    price: number;
    roles: string[];
    translations: IPlanTranslation[];
}