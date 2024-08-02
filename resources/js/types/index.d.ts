export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Unit  {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export interface StatusPegawai {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export interface Marhalah {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export interface Gologan {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export type ModelOnlyColumns<T, K extends keyof T> = Pick<T, K>;
export type ModelWithoutColumns<T, K extends keyof T> = Omit<T, K>;
export type ModelWithColumns<T, U> = T & U;


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    flash: { success?: string; error?: string };
    auth: {
        user: User;
        role: 'master' | 'unit';
    };
};

export type MTColor =
    | "transparent"
    | "white"
    | "blue-gray"
    | "gray"
    | "brown"
    | "deep-orange"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "light-green"
    | "green"
    | "teal"
    | "cyan"
    | "light-blue"
    | "blue"
    | "indigo"
    | "deep-purple"
    | "purple"
    | "pink"
    | "red";
