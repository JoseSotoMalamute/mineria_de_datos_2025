# Gestor de Salas con Google Apps Script y Google Sheets

Este proyecto provee los archivos necesarios para crear una Web App en Google Apps Script que permita administrar el uso de las salas de un preuniversitario.

## Funcionalidades

- Horario de operación de lunes a sábado entre las 08:30 y las 22:00 horas.
- Registro de reservas indicando sala (1 a 20), uso, responsable, hora de inicio y término.
- Visualización del horario diario por sala con todas las reservas creadas.
- Consulta de disponibilidad con bloques libres por sala para la fecha seleccionada.
- Selector de fecha para revisar o crear reservas en días específicos.

## Estructura de archivos

- `Code.gs`: Lógica del lado del servidor (Apps Script). Gestiona la hoja de cálculo, crea reservas, obtiene horarios y calcula la disponibilidad de salas.
- `index.html`: Plantilla principal de la Web App.
- `styles.html`: Estilos CSS para la interfaz.
- `scripts.html`: Lógica del lado del cliente que interactúa con los servicios de Apps Script.

## Configuración en Google Sheets y Apps Script

1. Crea o abre una hoja de cálculo de Google Sheets y asigna un nombre significativo.
2. En la hoja, abre **Extensiones → Apps Script** para crear el proyecto de Apps Script.
3. Reemplaza el contenido de `Code.gs` con el archivo provisto en este proyecto.
4. Crea archivos HTML en la sección **Editor** de Apps Script (`index.html`, `styles.html`, `scripts.html`) y pega el contenido correspondiente.
5. Guarda los cambios.

> La primera ejecución creará automáticamente la hoja `Reservas` con las columnas `Fecha`, `Sala`, `Inicio`, `Fin`, `Uso` y `Responsable`. El script también configura la validación de datos para asegurar que las salas estén entre 1 y 20.

## Despliegue como Web App

1. En el editor de Apps Script ve a **Implementar → Implementaciones nuevas**.
2. Selecciona el tipo **Aplicación web**.
3. Define una descripción y asegúrate de que el despliegue se ejecute como **Tú** y esté disponible para **Cualquiera con el enlace** (ajústalo según tus necesidades de acceso).
4. Haz clic en **Implementar** y autoriza los permisos solicitados.
5. Copia el URL generado. Esta será la dirección de la Web App.

## Uso

1. Abre la Web App y selecciona el día que deseas gestionar.
2. Completa el formulario para crear una nueva reserva y presiona **Guardar**.
3. El horario del día se actualizará automáticamente.
4. Usa el botón **Ver salas libres** para visualizar los bloques disponibles en cada sala.

## Personalización

- Ajusta el rango de fechas permitidas modificando la lógica en `setDateLimits` dentro de `scripts.html`.
- Cambia el horario de funcionamiento (08:30 a 22:00) editando los valores en `Code.gs` y en la inicialización del formulario en `scripts.html`.
- Si necesitas más salas, modifica el arreglo `ROOMS` en `Code.gs`.

## Consideraciones

- Las reservas se almacenan en la hoja `Reservas`. Puedes añadir filtros o vistas personalizadas desde Google Sheets para reportes adicionales.
- El script valida que no existan traslapes en las reservas de una misma sala.
- Se recomienda limitar el acceso de edición a la Web App y a la hoja para evitar modificaciones no controladas.

¡Listo! Con estos pasos tendrás una solución simple para administrar el uso de las salas en tu preuniversitario desde Google Sheets.
