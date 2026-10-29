import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
// interceptor function to log HTTP requests and errors
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    console.log(`[HTTP Request]: ${req.method} ${req.url}`);
    return next(req).pipe(
        // catch any errors that occur during the HTTP request
        catchError((error) => {
            console.error(`[HTTP Error]: ${req.url} - Status: ${error.status}`);
            return throwError(() => error);
        })
    );
};