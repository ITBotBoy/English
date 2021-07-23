export interface ItemInfo {
    en: string
    zh: string
    [propName:string]:any
}
export interface ListInfo {
    [propName: string]:ItemInfo[]
}
export interface CloudInfo {
    create_time: string
    update_time: string
}

