# Simulador OP1 — Operadora Energética I

Simulador paramétrico en tiempo real del Modelo Financiero de Operadora Energética I, para uso del **estructurador**.

Es autocontenido: no requiere el archivo de Excel. Muestra la misma información que se consultaría en el Excel, con la referencia a la hoja de origen de cada renglón, parámetro e indicador.

**Uso privado y confidencial.**

## Archivos
| Archivo | Uso |
|---|---|
| `simulador_op1.py` | Aplicación web (Streamlit). |
| `op1model.py` | Modelo financiero completo y catálogos de trazabilidad al Excel; es la única fuente de cálculo del simulador. |
| `requirements.txt` | Dependencias con versiones fijas (Python 3.13). |
| `.streamlit/config.toml` | Tema institucional, barra de herramientas reducida, sin telemetría y sin detalle de errores al usuario. |
| `.streamlit/secrets.toml.example` | Plantilla de la contraseña de acceso (opcional). |

## Integración en infraestructura propia
1. Copie `simulador_op1.py`, `op1model.py`, `requirements.txt` y la carpeta `.streamlit/` a una misma carpeta del servidor.
2. Instale las dependencias: `pip install -r requirements.txt`.
3. Ejecute la aplicación como servicio (systemd, supervisor, contenedor o el orquestador que ya utilice):
   ```bash
   streamlit run simulador_op1.py --server.address=0.0.0.0 --server.port=8501
   ```
   Si la publica bajo una ruta y no en un subdominio, agregue `--server.baseUrlPath=simulador`.
4. Publíquela detrás de su proxy con HTTPS. El proxy debe permitir WebSockets; en Nginx: `proxy_http_version 1.1`, `proxy_set_header Upgrade $http_upgrade` y `proxy_set_header Connection "upgrade"`.
5. Si la inserta en una página existente, use un iframe con `?embed=true`:
   ```html
   <iframe src="https://su-dominio.com/simulador/?embed=true" style="width:100%;height:1400px;border:0" title="Simulador OP1"></iframe>
   ```
6. Para comprobar el servicio, el endpoint de salud es `/_stcore/health`.

## Acceso
Hay dos opciones, según cómo controle el acceso su infraestructura:
- **Contraseña propia del simulador:** defina `APP_PASSWORD` en `.streamlit/secrets.toml`, o la variable de entorno `OP1_APP_PASSWORD`. El simulador la pide antes de mostrar cualquier cifra.
- **Autenticación de su infraestructura** (proxy, SSO, VPN): defina `OP1_AUTH_EXTERNA=1` para ocultar el aviso de "acceso sin contraseña".

Nunca suba `secrets.toml` a un repositorio.

## Contenido del simulador
| Pestaña | Qué muestra |
|---|---|
| Indicadores superiores | Indicadores del proyecto y de los inversionistas, con la diferencia contra el escenario Base. |
| Flujo de efectivo | Flujo neto anual y acumulado contra el Base. |
| Estado de resultados | Renglones de la hoja RENTA por año (Año 0 a Año 20). |
| Inversionistas | Aportación, disminución de capital, dividendos 90/10, retenciones y TIR. |
| Perfiles de riesgo | El mismo escenario corrido con cada perfil de inversionista. |
| Cuentas fiscales | CUCA, CUFIN, reserva legal, art. 78 e ISR art. 10, en la Operadora y en Akredita Me. |
| Sensibilidad | Tabla de TIR variando dos supuestos (25 corridas). |
| Detalle mensual | Los renglones de Mensualizacion, RENTA y Flujo mes por mes (ene-27 a dic-48), con unidad, hoja de origen y total. Incluye los bloques de inversionistas y de cuentas fiscales; cada bloque se descarga en CSV. |
| Supuestos | Todos los parámetros del modelo con el valor simulado, el del Base y su referencia en el Excel; marca los que cambiaron. Incluye el capital requerido y el CAPEX por partida. |
| Indicadores | Indicadores de la hoja RENTA (TIR, VPN, ROI, paybacks, por kWh, por kVA, etc.) contra el Base, y el ROI anual. |
| Exportar | Escenario simulado completo en Excel: supuestos, detalle mensual, anual, indicadores e inversionistas. |

En el detalle y en los supuestos, la referencia "No está en el archivo" marca los conceptos agregados al modelo después del Excel:
- IVA de las comisiones;
- préstamo intercompañías;
- posible reforma LISR 2027;
- sobrecosto;
- bloques de inversionistas y cuentas fiscales.

## Ejecución local
```bash
pip install -r requirements.txt
streamlit run simulador_op1.py
```

## Criterios del modelo (alineados con la presentación ejecutiva v18)
- **Cuadre con el Excel:** con `iva_comisiones=False`, que es como lo calcula el archivo, todos los renglones mensuales coinciden al peso.
- **Horizonte:** 264 meses (ene-27 a dic-48). Año 0 = periodo preoperativo de 23 meses (ene-27 a nov-28); 20 años de operación desde dic-28.
- **Capital requerido:** CAPEX + IVA de la inversión + comisiones de estructuración con su IVA (MXN 623.0 M en los tres escenarios). No se compensa con los ingresos por derechos de uso.
- **IVA de la inversión:** se trata como gasto (supuesto conservador, sin acreditamiento). Opcionalmente puede marcarse como recuperable.
- **Energía:** kWh = capacidad habilitada × 730 h × factor de energía. El factor incorpora el factor de carga y el factor de potencia (0.70 en Base).
- **PTU:** 5%, tasa efectiva supuesta.
- **Derechos de uso:** se presentan en el ejercicio de cobro (base fiscal, art. 17 LISR). Contablemente se reconocen al quedar disponible la capacidad y, mientras tanto, se registran como anticipo de clientes.
- **Comisiones de Akredita Me** (administración 3%, éxito 3%, levantamiento de capital): remuneran a la administración y no forman parte del retorno de los inversionistas.
- **Opción base de retorno (perfil Patrimonial):**
  - disminución de capital en 20 años, en línea con la depreciación, en la Operadora y en Akredita Me (mecanismo por definir);
  - dividendos con reserva legal y caja mínima de un mes;
  - 90% a Akredita Me, que los traslada a los inversionistas; 10% a los socios fundadores (promote, sin aportación de capital).
- **Payback:** medido desde ene-27, inicio del ejercicio del CAPEX (primer llamado de capital).
- **Posible reforma LISR 2027 (opcional):**
  - tope de deducciones, con remanente recuperable o no recuperable;
  - excepción de cinco ejercicios (2027–2031), sujeta a las reglas antiabuso.

Resultados con los valores por omisión (coinciden con la presentación):

| Escenario | TIR proyecto | TIR inversionistas | TIR inv. neta |
|---|---|---|---|
| Pesimista | 32.4% | 23.0% | 20.9% |
| Base | 46.4% | 30.1% | 27.3% |
| Optimista | 53.0% | 31.8% | 28.9% |

## Perfiles de riesgo
| Perfil | Aportación | Política de distribución |
|---|---|---|
| Conservador | 50% préstamo intercompañías (36 meses) + 50% capital | Mixta con tope fiscal |
| Balanceado | 30% préstamo intercompañías (60 meses) + 70% capital | Mixta con tope fiscal |
| Fiscal optimizado | 100% capital | Mixta con tope fiscal (CUCA y CUFIN) |
| Patrimonial (opción base) | 100% capital | Disminución en 20 años, en línea con la depreciación |
| Mixta sin tope (referencia) | 100% capital | Mixta (año 1: 50% a capital) |

El efecto del art. 78 LISR depende de la estructura accionaria: el capital ordinario de la Operadora y las acciones de los socios fundadores en Akredita Me. Es una aproximación para proyección y debe validarse con el asesor fiscal.
