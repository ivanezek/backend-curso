class UserDTO {
    constructor({ _id, username, email, role, lastConnection }) {
        this.id = _id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.lastConnection = lastConnection;
    }
}

module.exports = UserDTO;