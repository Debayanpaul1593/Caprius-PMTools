# CAPRIUS SERVER


**How to fix mongodb issue** 
[follow here](https://sondnpt00343.medium.com/how-to-fix-mongod-service-32dbbe51a4ee) 

## Difference between a session and a cookie
Session and cookie differs in the places that their data is stored

A cookie has it's data stored in the browser and that browser will attach the cookie data (key value pair) to every http request.
A session data will be stored on the server side (express JS application).
In a cookie we cannot store a whole lot of data. Also we cannot store user credentials or secret data as a hacker can easily get hold of that data. For session storage we will use a secret key for authentication.

By default express-session comes with its own implementation of a session storage but it is not using a database. FOr production it is better if we use a persistent storage like a database for managing session data.

The cookie in the browser will have the session id and we will use this session id to look up the entry in our database. Every cookie in a browser can have an expiration time after which the browser will stop attaching it to http requests. The cookie is attached to the setCookie header for http and will be in the response header. The browser will rerceive it and set it to the requests header for all subsequent http calls until expiration.

use ```req.session``` to extract the session object from request

Session object can be very useful for tracing information reg. a client or user
