# MamiFit

Web app estática para entrenar en casa en 20 minutos, enfocada en fuerza funcional y constancia.

## Novedades v2

- Selector de nivel (`Base`, `Intermedio`, `Día suave`).
- Temporizador real de 20 minutos por sesión.
- Calendario semanal visual de actividad.
- Plan premium llamado **MamiGorda** para acompañamiento extra hacia el objetivo MamiFit.

## Ejecutar en local

### Opción recomendada

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Abrir: `http://127.0.0.1:8080`

### Si usas Codespaces / VM / contenedor remoto

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Abrir: `http://localhost:8080` en la máquina donde corre el servidor, o el puerto reenviado por tu entorno.

## Ver la web desde un móvil (Mac → iPhone/Android)

1. Conecta Mac y móvil a la **misma Wi‑Fi**.
2. En Mac, obtiene tu IP local:

```bash
ipconfig getifaddr en0
```

> Si no devuelve nada, prueba `en1`.

3. Inicia el servidor accesible en red local:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

4. En el móvil abre:

```text
http://TU_IP_LOCAL:8080
```

Ejemplo: `http://192.168.1.34:8080`

### Si no abre en el móvil

- Revisa que ambos estén en la misma red.
- Desactiva VPN en Mac/móvil temporalmente.
- En macOS, permite Python en firewall: Ajustes del Sistema → Red → Firewall.
- Cambia a otro puerto si 8080 está ocupado:

```bash
python3 -m http.server 8081 --bind 0.0.0.0
```

## Solución de errores (ERR_CONNECTION_REFUSED)

1. Asegúrate de que el servidor sigue vivo y no cerraste la terminal.
2. Verifica que el puerto 8080 está escuchando:

```bash
ss -ltnp | rg 8080
```

3. Si el 8080 está ocupado, usa otro puerto:

```bash
python3 -m http.server 8081 --bind 127.0.0.1
```

Y abre `http://127.0.0.1:8081`.

## Archivos

- `index.html`: estructura y componentes.
- `styles.css`: tema visual responsive.
- `app.js`: estado, rutinas, timer, progreso y calendario.
