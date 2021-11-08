const express = require('express');
const authRoute = require('./auth.route');
const roomRoute = require('./room.route');
const userRoute = require('./user.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/rooms',
        route: roomRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;