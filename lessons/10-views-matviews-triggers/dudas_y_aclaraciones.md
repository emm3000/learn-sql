# Dudas y Aclaraciones: Views, Materialized Views y Triggers

## Duda 1

**Una view guarda datos**

No. Una view guarda la definicion de la consulta, no el resultado.

## Duda 2

**Una materialized view siempre es mejor**

No. Es mejor cuando consultas mucho lo mismo y aceptas refrescar el resultado. Si los datos cambian seguido, puede quedarse desactualizada o costar mas mantenerla. Recuerda que hay que ejecutar `REFRESH MATERIALIZED VIEW` para recalcularla.

## Duda 3

**Los triggers se usan en proyectos reales**

Si, pero con cuidado. Son utiles para auditoria, timestamps, reglas repetitivas y automatizaciones pequeñas. Si haces demasiada logica oculta con triggers, luego cuesta depurar.

## Duda 4

**Puede afectar performance**

Si. Una view puede ser casi gratis si el planner la integra bien, una materialized view cuesta al refrescar, y un trigger agrega costo en cada escritura.

## Duda 5

**Hay alternativa mejor a veces**

Si. A veces un query directo, una funcion, o la logica en la aplicacion es mas claro y mantenible.
