# Pretest · Prevención del cáncer

Cuestionario dinámico (colores de salud, modo oscuro automático) con 3 preguntas sobre hábitos saludables y prevención del cáncer de cuello uterino, próstata y colon. Pide nombre completo y fecha, permite observaciones, muestra puntaje con retroalimentación y **envía cada respuesta al correo** `janethangelicanarvaezfigueroa@gmail.com`.

## Estructura
- `index.html` – la aplicación (sin dependencias).
- `api/submit.js` – función serverless de Vercel que envía el correo con [Resend](https://resend.com).

## Publicar
1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel: **Add New → Project** → importa el repositorio → Deploy (sin configuración de build).
3. Crea una cuenta en https://resend.com **con el correo janethangelicanarvaezfigueroa@gmail.com** y genera una API Key.
   (Sin dominio verificado, Resend solo permite enviar al correo con el que se registró la cuenta.)
4. En Vercel: **Settings → Environment Variables** agrega:
   - `RESEND_API_KEY` = tu API Key
   - `TO_EMAIL` = janethangelicanarvaezfigueroa@gmail.com
5. **Deployments → Redeploy** para que tome las variables.
6. Comparte la URL de Vercel con los ~50 participantes. Revisa también la carpeta de spam la primera vez.

Respuestas correctas: 1-A, 2-B, 3-C (se editan en `index.html` y en `api/submit.js`).
