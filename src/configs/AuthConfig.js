//Configurações de experição do token do usuário authenticado

class AuthConfig {
    constructor() {
        this.secret = process.env.AUTH_SECRET || "default";
        this.expiresIn = "1d";
    }
}

export default AuthConfig;
