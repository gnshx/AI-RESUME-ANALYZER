import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),       
    route('/Auth','routes/Auth.tsx'),
    route('/Upload','routes/Upload.tsx'),
    route('/resume/:id','routes/resume.tsx'),
    route('/wipe','routes/wipe.tsx')
] satisfies RouteConfig;
