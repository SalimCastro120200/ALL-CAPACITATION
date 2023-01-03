// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  http      : {
    server: "http://localhost:8080",
    area  : {
      paginar          : "/ordenaris/api/area/paginar",
      lista            : "/ordenaris/api/area/lista",
      registro         : "/ordenaris/api/area/registrar",
      modificar        : "/ordenaris/api/area/#uuid#/modificar",
      actualizarEstatus: "/ordenaris/api/area/#uuid#/actualizar-estatus",
      informacion      : "/ordenaris/api/area/#uuid#/informacion"
    },
    empleado: {
      paginar          : "/ordenaris/api/empleado/paginar",
      registro         : "/ordenaris/api/empleado/registrar",
      modificar        : "/ordenaris/api/empleado/#uuid#/modificar",
      actualizarEstatus: "/ordenaris/api/empleado/#uuid#/actualizar-estatus",
      informacion      : "/ordenaris/api/empleado/#uuid#/informacion",
    }
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
