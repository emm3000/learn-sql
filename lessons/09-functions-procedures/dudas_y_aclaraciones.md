# Dudas y Aclaraciones: Functions y Procedures

## Duda 1

**Se usan de verdad en proyectos reales**

Si, sobre todo cuando quieres encapsular logica repetida, reglas de negocio y operaciones controladas dentro de la base.

## Duda 2

**Conviene meter toda la logica en funciones**

No. Si abusas de esto, la base se vuelve dificil de mantener. Conviene usarlo para logica claramente compartida o critica.

## Duda 3

**Function o procedure**

Function para devolver datos o calcular algo. Procedure para ejecutar acciones con efectos sobre datos y flujos operativos.

## Duda 4

**Puede afectar performance**

Si, dependiendo de la complejidad, del lenguaje usado y de cuantas veces se invoque. Las funciones simples en `LANGUAGE sql` suelen ser mas faciles de optimizar que logica compleja en `plpgsql`.

## Duda 5

**Hay una alternativa mejor a veces**

Si. A veces una consulta simple, una vista, o mover la logica a la aplicacion es mejor si no hay reutilizacion real o si la logica cambia mucho.

## Duda 6

**Puedo probar procedures sin miedo**

Mejor prueba en el seed o dentro de una transaccion cuando estes explorando. Un procedure puede cambiar datos reales, asi que en bases de trabajo conviene ser mas cuidadoso que con una function de solo lectura.
