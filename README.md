# Backend del buscador de productos Rosario __( [VER APP](https://davidoreiro97.github.io/BuscadorPreciosRosario/) )__
##
----
## Objetivos 
- ##### Comunicarse con el servicio de geolocalización "Here API". 
- ##### Hacer web scrapping de los supermercados solicitados.
##
---
## Consideraciones
- ##### Esta conectada a internet mediante dos tuneles gratuitos (localtunnel y ngrok) los cuales se pueden encontrar los scripts para mantener estos tuneles siempre renovandose en : [scripts_generar_endpoints](https://github.com/davidoreiro97/scripts_generar_endpointsAppsTesting) estos scripts son para powershell, reinician los servicios, observan que siempre el proceso esté corriendo (si se cae el proceso lo vuelve a levantar) y luego de 6 horas se reinicia localtunnel y 2 horas ngrok. Por último sube los enlaces de los endpoints generados a mi cuenta de Github [endpoints_tuneles](https://github.com/davidoreiro97/endpointsAppsTesting)                        

- ##### Ambos tuneles tienen un plan gratuito por lo que son inestables, en el frontend se hacen varios try para conectar primero a localtunnel y luego a ngrok, los try se cortan si el servidor responde con otro error que sea distinto a FETCH_ERROR (el cual se devuelve si no se puede conectar al tunel).
- ##
---
## Mejoras para el futuro
-  ##### Reemplazar los tuneles gratuitos con los tuneles de Cloudflare los cuales son mucho más estables, pero para eso necesito un nombre de dominio.
-  ##### `Este backend será refactorizado y esta versión quedara fuera de funcionamiento`, la idea en las próximas versiones sería que en lugar de hacer webscrapping a los resultados de una búsqueda se cree una base de datos la cual realice una vez a la semana un web scrapping a cada uno de los supermercados de todos sus productos y estos almacenarlos en una base de datos con la siguiente estructura : 
![image](https://github.com/user-attachments/assets/f7464ad6-61b5-492c-8d5c-12b7f31aff48)
-  ##### También para tener un solo backend para todos los proyectos que realice migraré a una arquitectura de microservicios en donde mediante estos tuneles conecte con un servidor express en general y mediante distintos endpoints pueda comunicarme con distintos servicios internos.
