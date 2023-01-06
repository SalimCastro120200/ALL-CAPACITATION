package com.practica.empresa

import grails.gorm.transactions.Transactional

@Transactional
class AreaService {
    def EmpleadoService
    def paginar( data ) {
        try {
            def _max = data.max ? data.max.toInteger() : 5
            def offset = ( --data.page.toInteger() * _max.toInteger())

            def lista = []
            def total = Area.countByEstatusNotEqual(3)

            if( data.search ) {
                total = Area.withCriteria {
                    ne("estatus", 3)
                    if( data.search ) {
                        or {
                            ilike( 'nombre', "%${data.search}%" )
                        }
                    }
                    projections{
                        rowCount()
                    }
                }[0]
            }

            Area.withCriteria {
                ne("estatus", 3)
                if( data.search ) {
                    or{
                        ilike( 'nombre', "%${data.search}%" )
                    }
                }
                firstResult(offset)
                maxResults _max
                order( data.sort, data.order )
            }.each { area ->
                lista.add([
                    uuid: area.uuid,
                    nombre: area.nombre,
                    estatus: area.estatus,
                    empleados: area.empleados.size()
                ])
            }

            return [ success: true, lista: lista, total: total ]
        } catch(e) {
            return [ success: false, mensaje: e.getMessage() ]
        }
    }
    def lista() {
        try {
            def lista = []
            Area.findAllByEstatus(1).each { area ->
                lista.add([
                    uuid: area.uuid,
                    nombre: area.nombre
                ])
            }
            return [ success: true, lista: lista ]
        }catch(e) {
            println "${new Date()} | AreaService | Gestionar | Error | ${e.getMessage()}"
            return [ success: false, mensaje: e.getMessage() ]
        }
        
    }
    def gestionar( data, uuid = null ) {
        Area.withTransaction { tStatus ->
            def nArea
            try {
                nArea = Area.findByUuid( uuid )
                if( !nArea ) {
                    nArea = new Area()
                }
                nArea.nombre = data.nombre
                nArea.save( flush: true, failOnError: true )
                return [ success: true ]
            } catch(e) {
                println "${new Date()} | AreaService | Gestionar | Error | ${e.getMessage()}"
                tStatus.setRollbackOnly()
                return [ success: false, mensaje: e.getMessage() ]   
            }            
        }
    }

    def actualizarEstatus( nEstatus, uuid ) {
        println(nEstatus)
        println(nEstatus.class)
        println(uuid)
        Area.withTransaction { tStatus ->
            def nArea
            try {
                nArea = Area.findByUuid( uuid )
                println(nArea)
                if( !nArea ) {
                    return [ success: false, mensaje: "No se encontro el area." ]
                }
                nArea.estatus = nEstatus
                println(nArea.empleados)
                // nArea.empleados.each { empleado ->
                //     println(empleado)
                //     empleado.removeFromAreas( nArea )
                //     empleado.save()
                // }  PENDIENTE A REVISIÓN

                nArea.save( flush: true, failOnError: true )
                return [ success: true ]
            } catch(e) {
                println "${new Date()} | AreaService | actualizarEstatus | Error | ${e.getMessage()}"
                e.stackTrace.each{newError->
                    if(newError.className.startsWith('com.practica.empresa.AreaService')){
                        println newError
                    }
                }
                tStatus.setRollbackOnly()
                return [ success: false, mensaje: e.getMessage() ]   
            }            
        }
    }

    def informacion( uuid ) {
        def nArea
        try {
            nArea = Area.findByUuid( uuid )
            if( !nArea ) {
                return [ success: false, mensaje: "No se encontro el area." ]
            }

            def empleados = []
            nArea.empleados.each { _empleado ->
                empleados.add( EmpleadoService.informacion_empleado(_empleado) )
            }

            def informacion =[
                uuid: nArea.uuid,
                nombre: nArea.nombre,
                estatus: nArea.estatus,
                empleados: empleados
            ]

            return [ success: true, informacion: informacion ]
        }catch(e) {
            println "${new Date()} | AreaService | informacion | Error | ${e.getMessage()}"
            return [ success: false, mensaje: e.getMessage() ]
        }
    }
}
