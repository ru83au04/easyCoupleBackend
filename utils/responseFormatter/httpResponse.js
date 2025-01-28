function httpResponse(status, message, ...data) {
    let res = {
        status: status,
        message: message, 
        data: data
    }
    return res;
}

class HttpResponse {
    constructor() {
        this.status = null;
        this.body = {};
    }
}

module.exports = {
    httpResponse
}