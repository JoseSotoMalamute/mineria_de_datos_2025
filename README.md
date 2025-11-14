# 🌍 Análisis Global de Calidad del Aire y Clima Actual con Python

Este proyecto explora datos globales de contaminación atmosférica y clima en tiempo real usando Python, Google BigQuery y OpenWeather API. Se generan visualizaciones interactivas para identificar zonas críticas en el mundo afectadas por partículas contaminantes como **PM2.5, PM10, Temperatura y O₃**.

---

## 📊 Herramientas y Librerías

pandas, numpy: Manejo y análisis de datos.

matplotlib, seaborn: Visualización estática (gráficos de barras, líneas, scatter, histogramas, etc.).

folium + HeatMap: Visualización geoespacial interactiva (mapa mundial, marcadores, capa de calor, etc.).

google-cloud-bigquery, google-auth: Conexión y consulta de datos públicos de calidad del aire desde BigQuery.

requests: Obtención de información climática en tiempo real desde la API de OpenWeather.

datetime, time: Manejo de fechas para segmentar y filtrar datasets.
---

## 🌐 Datos Utilizados

Global Air Quality: Extraído desde el dataset público bigquery-public-data.openaq.global_air_quality.

Se filtra y agrupa por contaminantes para obtener la concentración promedio por ubicación.

Se seleccionan datos del último año para concentrarnos en la situación actual.

Clima Actual (OpenWeather API):

Para ubicaciones específicas, se extraen variables como temperatura, humedad, presión, velocidad del viento y nubosidad.

Los datos se utilizan para relacionar las concentraciones de contaminantes con condiciones climáticas.


---

## 🗺️ Visualización principal

Mapa Interactivo Mundial:

Utilizando Folium, se genera un mapa con una capa de calor (HeatMap) de PM2.5 (u otros contaminantes) según la concentración registrada en cada ubicación.

La concentración se normaliza para hacer más visible la distribución a lo largo del globo.

Se incluyen marcadores opcionales con información detallada de la estación de monitoreo.

Gráficos de Análisis Exploratorio:

Histogramas y gráficos de barras para ver la distribución de concentraciones por contaminante.

Diagramas de dispersión (scatter plots) que relacionan variables como temperatura vs. contaminación para estudiar correlaciones.

Gráficos de línea para observar tendencias en el tiempo en regiones específicas.


---

## 🧪 Clima Actual

Mapa Interactivo Mundial:

Utilizando Folium, se genera un mapa con una capa de calor (HeatMap) de PM2.5 (u otros contaminantes) según la concentración registrada en cada ubicación.

La concentración se normaliza para hacer más visible la distribución a lo largo del globo.

Se incluyen marcadores opcionales con información detallada de la estación de monitoreo.

Gráficos de Análisis Exploratorio:

Histogramas y gráficos de barras para ver la distribución de concentraciones por contaminante.

Diagramas de dispersión (scatter plots) que relacionan variables como temperatura vs. contaminación para estudiar correlaciones.

Gráficos de línea para observar tendencias en el tiempo en regiones específicas.


---

## 📂 Estructura del Proyecto

```
📁 solemne1_jose_soto
│
├── solemne1_jose_soto.ipynb             # Notebook principal con el análisis y visualizaciones
├── mapa_pm25_mundial_ultimo_anio.html  # Mapa interactivo generado con folium
├── README.md                            # Descripción del proyecto
├── requirements.txt                     # Dependencias del proyecto

```
---

## ▶️ Cómo usar este repositorio

Clona este repositorio:
```
git clone https://github.com/tu_usuario/solemne1_jose_soto.git
cd solemne1_jose_soto
```
Instala las dependencias:
```
pip install -r requirements.txt
```
Asegúrate de tener configuradas tus credenciales de Google Cloud para BigQuery (archivos JSON o variables de entorno, según tu configuración).
Más detalles en Autenticación de BigQuery.

Agrega tu clave de OpenWeather API (por ejemplo, definiendo una variable de entorno OPENWEATHER_API_KEY o usando un archivo local con la clave).

Ejecuta el notebook:
```
jupyter notebook solemne1_jose_soto.ipynb
```
Sigue las celdas en orden:

Conexión a BigQuery y consultas.

Análisis de datos, limpiezas y transformaciones.

Generación de gráficos exploratorios.

Llamadas a OpenWeather API y visualización del clima.

Creación del mapa interactivo en HTML.

Explora el mapa mapa_pm25_mundial_ultimo_anio.html para visualizar la distribución geoespacial de la contaminación en el último año.
---

## 📦 Requisitos

Python 3.7+

Cuenta y credenciales configuradas para Google Cloud BigQuery (si ejecutas localmente).

Clave de la OpenWeather API para extraer datos climáticos.
Instala las dependencias necesarias:
```
pip install -r requirements.txt

```
---

## 🧠 Autor

**Jose Luis Soto Pezoa**  
Estudiante de Ingeniería Física, entusiasta del análisis de datos y la física de partículas.

---

## 📝 Licencia

Este proyecto es de uso educativo y académico.

---

## 🎁 Web App de Amigo Secreto (Google Apps Script)

El repositorio ahora incluye un proyecto de **Google Apps Script** listo para desplegar como aplicación web y organizar un sorteo de amigo secreto.

### 📂 Archivos principales

| Archivo | Descripción |
| --- | --- |
| `appsscript.json` | Configuración del proyecto (zona horaria, permisos de la app web, runtime V8). |
| `Code.gs` | Lógica del lado del servidor: registro de participantes, validación de administrador, sorteo y envío de correos. |
| `Index.html` | Interfaz web para los participantes y panel del administrador con cuenta regresiva configurable. |

### 🚀 Pasos para desplegar

1. Abre la hoja de cálculo de Google que utilizarás para el sorteo (o crea una nueva) y asegúrate de que exista una pestaña llamada **`amigo_secreto`**.
2. Desde la hoja, ve a `Extensiones → Apps Script` para abrir el proyecto vinculado.
3. Reemplaza el contenido de los archivos por los de este repositorio (`appsscript.json`, `Code.gs` e `Index.html`).
4. Verifica que el correo del administrador (`jsotopezoa@gmail.com`) y la contraseña (`c081208cC$`) estén correctamente definidos en `Code.gs` (constantes `ADMIN_EMAIL` y `ADMIN_PASSWORD`).
5. En `Implementar → Implementar como aplicación web` selecciona:
   - **Ejecutar la aplicación como:** Tú mismo.
   - **Quién tiene acceso:** Cualquiera con el enlace (o restringido según tus necesidades).
   - Durante la primera ejecución, autoriza los permisos solicitados para que el script pueda enviar correos mediante MailApp (no es necesario habilitar manualmente la API de Gmail).
6. Guarda la implementación y copia la URL proporcionada para compartirla con los participantes.
7. En la primera inscripción con foto se creará automáticamente en tu Google Drive una carpeta llamada **“Amigo Secreto - Imágenes”**, donde quedarán almacenadas todas las fotografías.

### ✨ Funcionalidades clave

- **Registro de participantes:** formulario para nombre, correo y tres ideas de regalo (≈ $20.000 CLP) con enlace de compra y carga directa de fotos desde el dispositivo.
- **Cuenta regresiva visible:** el administrador configura la fecha límite y todos los visitantes ven el temporizador en tiempo real.
- **Panel del administrador:** solo `jsotopezoa@gmail.com` puede validar acceso (ingresando correo y contraseña), ver listado de participantes, ajustar la cuenta regresiva y ejecutar el sorteo.
- **Tema navideño renovado:** interfaz más grande, con colores festivos, efectos de nieve y tarjetas decorativas para destacar la experiencia de inscripción.
- **Sorteo automático y notificaciones:** se asigna un amigo secreto a cada participante, enviando un correo con el destinatario y sus sugerencias de regalo. El administrador recibe un resumen del sorteo.
- **Almacenamiento centralizado:** cada registro queda guardado en la hoja de cálculo `amigo_secreto` y las fotos se conservan en una carpeta de Google Drive accesible mediante enlace.

> 💡 Puedes personalizar los textos y estilos modificando `Index.html` y ajustar la lógica del sorteo en `Code.gs` si necesitas más restricciones (por ejemplo, evitar que personas de un mismo grupo se asignen entre sí).

### 🗂️ Estructura de los datos almacenados

- La pestaña `amigo_secreto` guarda cada registro con columnas para correo, nombre, tres opciones de regalo, enlaces, URL pública de la foto y el identificador interno del archivo en Drive.
- Las imágenes se suben automáticamente a la carpeta **“Amigo Secreto - Imágenes”** del administrador, con permisos de visualización para cualquier persona que tenga el enlace.
- El sorteo borra el último resultado guardado cuando un participante actualiza su información, garantizando que siempre se vuelva a sortear antes de notificar.
