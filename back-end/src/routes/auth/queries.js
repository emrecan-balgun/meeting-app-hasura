export const IS_EXISTS_USER = `
    query isExistEmail($email: String!) {
        users(
        where: {
        email: {
            _eq: $email
        }
        }
        ){
        id
        }
    }
`