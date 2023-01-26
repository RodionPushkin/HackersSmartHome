module.exports = class ApiException extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static Unauthorized() {
        return new ApiException(401, 'Пользователь не авторизирован!')
    }

    static Authorized() {
        return new ApiException(400, 'Пользователь уже авторизирован!')
    }

    static DeviceUnauthorized() {
        return new ApiException(401, 'Устройство не авторизировано!')
    }

    static DeviceAuthorized() {
        return new ApiException(400, 'Устройство уже авторизировано!')
    }

    static BadRequest(message, errors = []) {
        return new ApiException(400, message, errors)
    }
}
