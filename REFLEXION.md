# Reflexión: CI y Control de Calidad

## 1. ¿Qué evita el CI?

El CI (Integración Continua) mediante GitHub Actions evita que código defectuoso llegue a la rama principal (`main`). Específicamente:

- **Cambios que rompen el contrato API**: Si alguien modifica `procesar.js` y cambia la estructura de respuesta (ej: elimina `timestamp` o `resultado`), las pruebas fallarán automáticamente.
- **Errores de sintaxis o imports**: El paso de `npm install` y `npm test` detecta problemas que impedirían la ejecución.
- **Inconsistencias en formato**: La verificación de estructura JSON en el workflow valida que la respuesta sea válida y tenga los campos esperados.

Ejemplo: Si `toUpperCase()` se cambia a `toLowerCase()`, la prueba que espera "JUAN" fallará.

---

## 2. ¿Qué NO evita el CI?

El CI no puede prevenir todo. Específicamente, **no evita**:

- **Errores lógicos sutiles**: Si la lógica de negocio cambia pero sigue pasando las pruebas (ej: hacer que `nombre === "error"` devuelva 200 en lugar de 500, pero la prueba no lo cubre).
- **Rendimiento degradado**: Un algoritmo lento que no afecta las pruebas pasará igualmente.
- **Falta de pruebas**: Si no existen pruebas para un comportamiento, CI no puede validarlo. (Ej: pruebas de caracteres especiales, límites de longitud).
- **Vulnerabilidades de seguridad no obvias**: Inyección SQL, XSS, etc. requieren pruebas específicas de seguridad.

---

## 3. ¿Qué pasa si se ignora el CI?

Si un desarrollador ignora el CI (ej: mergea sin esperar que pase el workflow):

- **Código roto en producción**: Cambios no validados llegan a la rama principal.
- **Falta de historial de validación**: No hay constancia de que las pruebas pasaron en ese commit.
- **Difícil recuperación**: Si algo falla en producción, no hay punto de validación anterior que garantice estabilidad.
- **Deuda técnica**: Con el tiempo, sin CI, el código se degrada sin mecanismo de control.

**Ejemplo real**: Si se permite el push que cambia `toUpperCase()` a `toLowerCase()` sin pasar CI, los usuarios verían nombres en minúsculas y el servicio sería inconsistente con su contrato.

---

## Política Mínima de Calidad

El proyecto implementa una verificación de estructura JSON en el workflow:

```json
{
  "validRequirements": [
    {
      "test": "Respuesta debe incluir 'resultado'",
      "status": "required"
    },
    {
      "test": "Respuesta debe incluir 'timestamp' (ISO 8601)",
      "status": "required"
    },
    {
      "test": "Nombre debe estar en MAYÚSCULAS (excepto en error)",
      "status": "required"
    },
    {
      "test": "Error simulado devuelve status 500",
      "status": "required"
    }
  ]
}
```

Estas reglas se validan en:
- **Pruebas unitarias** (`procesar.test.js`)
- **Workflow CI** (validación de estructura)
- **Cada push** (ejecución automática)

