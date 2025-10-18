import { HttpInterceptorFn } from '@angular/common/http';

export const httpBooleanInterceptor:
HttpInterceptorFn = (req, next) => {

    const requestWithHeaders = req.clone({
        headers: req.headers.append("MyHeader", "ToDoApplication"),
    });

    return next(requestWithHeaders);
};
