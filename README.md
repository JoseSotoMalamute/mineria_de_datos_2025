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
