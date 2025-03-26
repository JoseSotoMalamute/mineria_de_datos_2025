
# 🌍 Análisis Global de Calidad del Aire y Clima Actual con Python

Este proyecto explora datos globales de contaminación atmosférica y clima en tiempo real usando Python, Google BigQuery y OpenWeather API. Se generan visualizaciones interactivas para identificar zonas críticas en el mundo afectadas por partículas contaminantes como **PM2.5, PM10, NO₂, CO, SO₂ y O₃**.

---

## 📊 Herramientas y Librerías

- `pandas`, `numpy` — manejo y análisis de datos
- `matplotlib`, `seaborn` — visualización estática
- `folium` + `HeatMap` — visualización geoespacial interactiva
- `Google BigQuery` — consulta de datos públicos de calidad del aire
- `OpenWeather API` — extracción de datos meteorológicos actuales

---

## 🌐 Datos Utilizados

1. **Global Air Quality**: extraído desde el dataset público `bigquery-public-data.openaq.global_air_quality`.
2. **Clima actual**: recuperado mediante `OpenWeather API` para ubicaciones específicas.

---

## 🗺️ Visualización principal

Se genera un mapa mundial interactivo (`.html`) con una capa de calor (HeatMap) basada en la concentración de contaminantes atmosféricos. Se incluye una leyenda personalizada para facilitar la interpretación.

---

## 🧪 Clima Actual

Se consulta el clima en tiempo real (temperatura, humedad, lluvia, presión, viento, nubosidad) y se visualiza en un gráfico tipo `scatter`.

---

## 📂 Estructura del Proyecto

```
📁 solemne1_jose_soto
│
├── solemne1_jose_soto.ipynb       # Notebook principal con el análisis
├── mapa_pm25_mundial_ultimo_anio.html  # Mapa interactivo generado
├── README.md                      # Descripción del proyecto
```

---

## ▶️ Cómo usar este repositorio

1. Clona este repositorio
2. Instala las dependencias necesarias (ver más abajo)
3. Ejecuta el notebook `solemne1_jose_soto.ipynb`

---

## 📦 Instalación

```bash
pip install pandas numpy matplotlib seaborn folium google-cloud-bigquery google-auth requests
```

---

## 🧠 Autor

**Jose Luis Soto Pezoa**  
Estudiante de Ingeniería Física, entusiasta del análisis de datos, y la física de partículas .

---

## 📝 Licencia

Este proyecto es de uso educativo y académico.
