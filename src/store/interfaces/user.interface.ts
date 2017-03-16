export interface UserAuthentification {
    email: string;
    password: string;
}

export interface NewUserAuthentification {
    email: string;
    newpassword: string;
}

export interface User {
    hashId: string;
}
