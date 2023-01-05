
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
