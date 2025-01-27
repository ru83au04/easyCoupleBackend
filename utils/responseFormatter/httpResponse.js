function successResponse(status, message, ...data) {
    const res = new HttpResponse({
        status: status,
        body: {
            message: message,
            data: data
        }
    });
    
    return res;
}

class HttpResponse {
    constructor() {
        this.status = null;
        this.body = {};
    }
}

module.exports = {
    successResponse
}