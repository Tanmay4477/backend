enum Role {
    Admin = "admin",
    User = "user"
}

type Payload = {
    userId: string,
    role: Role
}

export default Payload;