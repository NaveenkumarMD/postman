var __pika_web_default_export_for_treeshaking__ = (instance, callback) => {
    instance.interceptors.request.use((request) => {
        request.ts = performance.now();
        return request
    });

    instance.interceptors.response.use((response) => {
        callback(Number(performance.now() - response.config.ts));
        return response
    });
};

export default __pika_web_default_export_for_treeshaking__;
