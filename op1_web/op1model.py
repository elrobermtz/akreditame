"""
op1model.py — Modelo Financiero de Operadora Energética I (OP1), autocontenido.

Réplica completa del Modelo Financiero OP1 (hojas Datos Generales, Mensualizacion, RENTA y Flujo) más la
estructura de inversión de Akredita Me / Fideicomiso OPE-I. No requiere el Excel: todos los insumos están en este
módulo y se pueden modificar por parámetro.

Cuadre con el archivo (escenario Base con iva_comisiones=False, que es como lo calcula el archivo):
    TIR 46.76% · VPN al 17% MXN 641.2 M · ROI promedio anual 39.35% · Payback 2.8 años ·
    Payback con intereses al 17% 3.7 años · Utilidad/Flujo 0.35/0.35 MXN/kWh · Periodo preoperativo 23 meses
    (paybacks medidos desde ene-27, inicio del ejercicio del CAPEX y primer llamado de capital)

Uso básico:
    from op1model import run, kpis, inversionistas, escenario
    r = run()                                   # caso Base del modelo
    r = run(precio_kva_2027=8400, factor_energia=0.75)
    r = escenario("Pesimista")                  # presets
    inv = inversionistas(r)                      # retorno a los inversionistas (opción base: perfil Patrimonial)
    exportar_excel(r, "salida.xlsx")             # auditoría en Excel (opcional)

Convenciones: cifras nominales en MXN; meses 1..264 = ene-2027..dic-2048; Año 0 = periodo preoperativo (meses 1..cod-1);
Año k = bloques de 12 meses a partir del inicio de operación.
"""
from __future__ import annotations

import copy
import numpy as np
import numpy_financial as npf

# =====================================================================================================
# 1. DATOS GENERALES Y CALENDARIOS DEL ARCHIVO
# =====================================================================================================
DATOS_GENERALES = dict(
    proyecto="SE OP1 — Operadora Energética I, S.A. de C.V.",
    tipo_proyecto="Incremento de ingresos",
    fecha_inicio_desarrollo="2027-01-01",
    fecha_termino_desarrollo="2028-11-01",
    fecha_inicio_beneficios="2028-12-01",
    fecha_fin_beneficios="2048-12-01",
    plazo_analisis_meses=240,
    moneda="MXN",
)
N = 264                     # ene-2027 .. dic-2048
ANIO_INICIAL = 2027

# Derechos de uso de capacidad: kVA colocados por mes (renglón "Derecho de uso" de Mensualizacion)
_VENTAS_BASE = {8: 3000, 9: 5625, 10: 5625, 11: 5625, 12: 12000, 13: 5750, 14: 5750, 15: 5750, 16: 5750, 17: 5750,
                18: 5750, 19: 3250, 20: 3250, 21: 2875, 22: 2875, 23: 2875, 24: 2875, 25: 2875, 26: 2875, 27: 2875,
                28: 2875, 29: 4125}
BASE_SALES = np.zeros(N)
for _m, _v in _VENTAS_BASE.items():
    BASE_SALES[_m - 1] = _v

# Inversión (CAPEX) por partida, calendario mensual exacto del archivo (MXN, sin IVA)
_CAPEX_MENSUAL = {
    "Ingenierías": [6167140.625],
    "SE Interna - Obra": [0, 0, 37130258.615625, 20651098.889063, 15204226.098437, 5606285.440625, 5214634.54375, 11957240.223437,
                          7783621.55, 5755391.335938, 10768407.676562, 7489800.15625, 5634934.135938, 8700149.764062, 7840363.535938,
                          4529091.317188, 2457213.0125, 4576587.003125, 2698278.534375, 1120995.590625, 476142.015625],
    "SE Interna - Suministro": [0, 0, 60488342.254688, 2561078.95, 26288596.546875, 10690717.735938, 11817635.292188, 27983707.378125,
                                11228934.13125, 10488391.560937, 689202.121875, 6511096.621875, 34401885.495313, 55901.045313, 0, 0, 14041500],
    "Línea de Transmisión - Obra": [0, 0, 0, 0, 2452257.55625, 905277.15, 843753.55, 914066.384375, 870120.790625, 808597.132812,
                                    676760.698438, 0, 1726642.057812, 876452.3, 902745.8875, 876452.3, 569693.971875],
    "Línea de Transmisión - Suministro": [0, 0, 0, 0, 0, 9950352.303125, 1147395.032812, 1253126.521875, 10149834.103125,
                                          1111964.757812, 1219384.198438, 1206863.6875, 5561847.573438],
    "SE CFE - Obra": [0, 0, 11057037.507812, 6081370.64375, 10522288.301562, 5682450.51875, 1459377.934375, 680792.484375,
                      704417.273438, 2110752.354687, 3298834.379687, 1986359.973438, 2467369.165625, 1449319.6, 1098600.820312,
                      567920.16875, 535174.9375, 203802.359375, 205860.773438, 166747.148438],
    "SE CFE - Suministro": [0, 0, 6128027.817187, 0, 0, 9306645.38125, 2935034.076563, 9456190.189063, 2884763.275, 1753870.99375,
                            1882844.20625, 3208849.5125],
}
CAPEX_ITEMS = {k: np.pad(np.array(v, dtype=float), (0, N - len(v))) for k, v in _CAPEX_MENSUAL.items()}

# =====================================================================================================
# 2. PARÁMETROS (todos modificables en run(**parámetros))
# =====================================================================================================
DEFAULT = dict(
    # --- Capacidad y calendario
    capacidad_total=100000.0,        # kVA instalados (100 MVA)
    mes_cod=24,                      # inicio de operación (dic-2028)
    vida_meses=240,                  # 20 años de operación y depreciación
    activacion_inicial=50000.0,      # kVA habilitados en el mes de inicio de operación
    activacion_mensual=5000.0,       # kVA adicionales habilitados por mes
    activa_solo_vendido=True,        # la capacidad habilitada no excede los kVA colocados
    # --- Derechos de uso (venta de kVA)
    sales=BASE_SALES,                # kVA colocados por mes (array de 264)
    precio_kva_2027=8000.0,          # MXN por kVA, base 2027
    mes_inicio_precio=9,             # el precio aplica desde sep-2027 (los 3,000 kVA de ago-2027 sin precio en el archivo)
    # --- Energía submedida
    horas_mes=730.0,
    factor_energia=0.70,             # factor de energía: incorpora factor de carga y factor de potencia (kWh = kVA activos x horas x factor)
    costo_cfe_2027=1.80,             # MXN/kWh en AT
    precio_mt_2027=2.20,             # MXN/kWh en MT
    # --- Inflación (escalar o lista anual 2027..2048)
    inflacion=0.045,
    # --- Costos de operación (MXN por mes, base 2027; se indexan) y seguro
    mant_mes_2027=937500.0,          # Opex mantenimiento de subestación
    submed_mes_2027=156250.0,        # Opex de submedición
    project_manager_mes_2027=0.0,    # renglón "Project Manager" (0 en el archivo)
    seguro_pct=0.015,                # prima de seguro de activos, % anual del CAPEX
    # --- Comisiones de Akredita Me (remuneran a la administración; no forman parte del retorno de los inversionistas)
    fee_admin=0.03,                  # % de ingresos totales
    comision_exito=0.03,             # % del CAPEX total, en el mes 1
    fee_levantamiento=0.02 / 18.5,   # razón observada en el archivo sobre la inversión mensual (2% x 1/18.5)
    # --- Inversión
    capex_factor=1.0,                # 1.10 = sobrecosto de 10% en todas las partidas
    capex_partidas=None,             # dict opcional {partida: array mensual} para sustituir el calendario
    vida_partidas=None,              # dict opcional {partida: meses de vida útil}; por omisión vida_meses
    iva=0.16,
    iva_recuperable=False,           # False = como el archivo: IVA de la inversión como gasto (supuesto conservador, sin acreditamiento)
    iva_comisiones=True,             # IVA de 16% sobre comisión de éxito y levantamiento de capital (no está en el archivo)
    meses_devolucion_iva=6,          # si es recuperable, meses entre el pago y la devolución
    # --- Impuestos y gasto corporativo
    gasto_corp=0.01,                 # % de la utilidad antes de gasto corporativo
    ptu=0.05,                        # tasa efectiva supuesta (la tasa legal es 10%, con tope de tres meses de salario)
    isr=0.30,
    # --- Financiamiento bancario (0 en el archivo; renglones Disposición/Pago/Saldo/Tasa/Comisión/Prima)
    credito_monto=0.0,
    credito_mes_disposicion=3,
    credito_gracia_meses=0,
    credito_plazo_meses=120,
    credito_tasa=0.092,
    credito_comision_apertura=0.01,
    credito_prima_cobertura=0.0,     # % anual sobre saldo (cobertura cambiaria)
    # --- Préstamo intercompañías de Akredita Me a la Operadora (fracción de la aportación de los inversionistas)
    prestamo_ic_pct=0.0,             # % de los usos (CAPEX + IVA + comisiones) que se aporta como préstamo y no como capital
    prestamo_ic_tasa=0.10,           # tasa anual de mercado (arts. 179-180 LISR)
    prestamo_ic_plazo_meses=36,      # amortización lineal a partir del inicio de operación
    # --- Descuento
    tasa_desc=0.17,                  # con financiamiento
    tasa_desc_rp=0.13,               # recursos propios (columna derecha de RENTA)
    # --- Posible reforma LISR 2027 (iniciativa)
    tope_deducciones=False,
    excepcion_5_ejercicios=False,    # la Operadora se constituirá en 2027: cubriría 2027-2031, sujeta a reglas antiabuso
    remanente_recuperable=True,
)

# Escenarios de la presentación
ESCENARIOS = {
    "Pesimista": dict(ritmo=1.5, precio_kva_2027=7200, factor_energia=0.60, precio_mt_2027=2.15),
    "Base": dict(ritmo=1.0),
    "Optimista": dict(ritmo=0.75, precio_kva_2027=8400, factor_energia=0.75, precio_mt_2027=2.20),
}


# Catálogos de trazabilidad: concepto, unidad y referencia en el archivo Excel (hoja / renglón)
# ------------------------------------------------------------------------------------------------
# PARAMETROS_INFO: {parámetro: (descripción, unidad, referencia en el Excel)}
PARAMETROS_INFO = {
    "capacidad_total": ("Capacidad instalada", "kVA", "Datos Generales"),
    "mes_cod": ("Mes de inicio de operación (1 = ene-27)", "mes", "Datos Generales: inicio de beneficios"),
    "vida_meses": ("Vida de operación y depreciación", "meses", "Datos Generales: plazo de análisis"),
    "activacion_inicial": ("Capacidad habilitada al inicio de operación", "kVA", "Mensualizacion: capacidad activa"),
    "activacion_mensual": ("Capacidad habilitada adicional por mes", "kVA/mes", "Mensualizacion: capacidad activa"),
    "activa_solo_vendido": ("La capacidad habilitada no excede los kVA colocados", "sí/no", "Criterio del modelo"),
    "precio_kva_2027": ("Precio del derecho de uso, base 2027", "MXN/kVA", "Mensualizacion: precio por kVA"),
    "mes_inicio_precio": ("Mes desde el que aplica el precio por kVA", "mes", "Mensualizacion: derecho de uso"),
    "horas_mes": ("Horas por mes", "h", "Mensualizacion: generación de energía"),
    "factor_energia": ("Factor de energía (carga y potencia)", "fracción", "Mensualizacion: generación de energía"),
    "costo_cfe_2027": ("Costo de suministro CFE en AT, base 2027", "MXN/kWh", "Mensualizacion: costo de energía"),
    "precio_mt_2027": ("Precio de venta de energía en MT, base 2027", "MXN/kWh", "Mensualizacion: ingreso por submedición"),
    "inflacion": ("Inflación anual (índice de precios y costos)", "%", "Datos Generales / Mensualizacion: índice"),
    "mant_mes_2027": ("Opex de mantenimiento de subestación, base 2027", "MXN/mes", "Mensualizacion: Opex mantenimiento"),
    "submed_mes_2027": ("Opex de submedición, base 2027", "MXN/mes", "Mensualizacion: Opex submedición"),
    "project_manager_mes_2027": ("Project manager, base 2027", "MXN/mes", "Mensualizacion: Project Manager"),
    "seguro_pct": ("Prima de seguro de activos", "% anual del CAPEX", "Mensualizacion: prima de seguro"),
    "fee_admin": ("Comisión de administración de Akredita Me", "% de ingresos", "Mensualizacion: fee de administración"),
    "comision_exito": ("Comisión de éxito de Akredita Me", "% del CAPEX, mes 1", "Mensualizacion: comisión al éxito"),
    "fee_levantamiento": ("Comisión por levantamiento de capital", "razón sobre inversión mensual", "Mensualizacion: fee de levantamiento"),
    "capex_factor": ("Factor de sobrecosto de la inversión (1.00 = presupuesto)", "factor", "No está en el archivo"),
    "iva": ("Tasa de IVA", "%", "Mensualizacion: IVA de la inversión"),
    "iva_recuperable": ("IVA de la inversión recuperable (falso = gasto, supuesto conservador)", "sí/no", "Criterio del archivo: no recuperable"),
    "iva_comisiones": ("IVA sobre comisiones de éxito y levantamiento de capital", "sí/no", "No está en el archivo"),
    "meses_devolucion_iva": ("Meses para la devolución del IVA, si es recuperable", "meses", "No está en el archivo"),
    "gasto_corp": ("Gasto corporativo", "% de la utilidad antes de gasto corporativo", "RENTA: gasto corporativo"),
    "ptu": ("PTU, tasa efectiva supuesta", "%", "RENTA: PTU"),
    "isr": ("ISR", "%", "RENTA: ISR"),
    "credito_monto": ("Crédito bancario", "MXN", "Flujo: disposición de crédito"),
    "credito_mes_disposicion": ("Mes de disposición del crédito", "mes", "Flujo: disposición de crédito"),
    "credito_gracia_meses": ("Gracia del crédito", "meses", "Flujo: pago de crédito"),
    "credito_plazo_meses": ("Plazo del crédito", "meses", "Flujo: pago de crédito"),
    "credito_tasa": ("Tasa del crédito", "% anual", "Flujo: interés de crédito"),
    "credito_comision_apertura": ("Comisión por apertura", "% del crédito", "Flujo: comisión por apertura"),
    "credito_prima_cobertura": ("Prima de cobertura cambiaria", "% anual sobre saldo", "Flujo: prima de cobertura T.C."),
    "prestamo_ic_pct": ("Aportación como préstamo intercompañías", "% de los usos", "No está en el archivo"),
    "prestamo_ic_tasa": ("Tasa del préstamo intercompañías", "% anual", "No está en el archivo"),
    "prestamo_ic_plazo_meses": ("Plazo de amortización del préstamo intercompañías", "meses", "No está en el archivo"),
    "tasa_desc": ("Tasa de descuento (VPN)", "% anual", "RENTA: VPN"),
    "tasa_desc_rp": ("Tasa de descuento, recursos propios", "% anual", "RENTA: VPN recursos propios"),
    "tope_deducciones": ("Posible reforma LISR 2027: tope de deducciones", "sí/no", "No está en el archivo"),
    "excepcion_5_ejercicios": ("Excepción por menos de cinco ejercicios (2027-2031)", "sí/no", "No está en el archivo"),
    "remanente_recuperable": ("Remanente de deducciones recuperable", "sí/no", "No está en el archivo"),
}

# SERIES_MENSUALES: [(clave en run(), concepto, unidad, referencia en el Excel)] en el orden del archivo
SERIES_MENSUALES = [
    ("sales", "Derecho de uso (kVA colocados)", "kVA", "Mensualizacion"),
    ("precio_kva", "Precio por kVA indexado", "MXN/kVA", "Mensualizacion"),
    ("act", "Capacidad activa", "kVA", "Mensualizacion"),
    ("kwh", "Generación de energía", "kWh", "Mensualizacion"),
    ("precio_kwh", "Precio de energía en MT indexado", "MXN/kWh", "Mensualizacion"),
    ("costo_kwh", "Costo de energía CFE indexado", "MXN/kWh", "Mensualizacion"),
    ("ing_kva", "Ingreso por derechos de uso", "MXN", "Mensualizacion / RENTA"),
    ("ing_kwh", "Ingreso por submedición", "MXN", "Mensualizacion / RENTA"),
    ("ingresos", "Total ingresos", "MXN", "RENTA"),
    ("costo_e", "Costo de energía", "MXN", "RENTA"),
    ("mant", "Opex mantenimiento subestación", "MXN", "RENTA"),
    ("subm", "Opex submedición", "MXN", "RENTA"),
    ("seguro", "Prima de seguro de activos", "MXN", "RENTA"),
    ("fee_adm", "Fee de administración", "MXN", "RENTA"),
    ("exito", "Comisión al éxito", "MXN", "RENTA"),
    ("fee_lev", "Fee de levantamiento de capital", "MXN", "RENTA"),
    ("pm", "Project manager", "MXN", "RENTA"),
    ("egresos", "Total egresos", "MXN", "RENTA"),
    ("capex_m", "Total inversión (CAPEX)", "MXN", "Mensualizacion / RENTA"),
    ("dep", "Depreciación", "MXN", "RENTA"),
    ("gcorp", "Gasto corporativo", "MXN", "RENTA"),
    ("udo", "Utilidad directa operativa", "MXN", "RENTA"),
    ("comision", "Comisión por apertura de crédito", "MXN", "Flujo"),
    ("interes", "Interés de crédito", "MXN", "Flujo"),
    ("prima", "Prima de cobertura T.C.", "MXN", "Flujo"),
    ("ic_int", "Intereses del préstamo intercompañías", "MXN", "No está en el archivo"),
    ("financ", "Total financiamiento", "MXN", "RENTA / Flujo"),
    ("uai", "Utilidad antes de impuestos", "MXN", "RENTA"),
    ("ptu", "PTU devengada", "MXN", "RENTA"),
    ("ptu_pay", "PTU pagada (mayo)", "MXN", "Flujo"),
    ("isr", "ISR", "MXN", "RENTA"),
    ("un", "Utilidad neta", "MXN", "RENTA"),
    ("iva_inv", "IVA de la inversión", "MXN", "Flujo"),
    ("iva_dev", "Devolución de IVA (si es recuperable)", "MXN", "No está en el archivo"),
    ("iva_com", "IVA de las comisiones de estructuración", "MXN", "No está en el archivo"),
    ("disp", "Disposición de crédito", "MXN", "Flujo"),
    ("pago", "Pago de crédito", "MXN", "Flujo"),
    ("saldo", "Saldo de crédito", "MXN", "Flujo"),
    ("flujo_operacion", "Flujo de operación", "MXN", "Flujo"),
    ("fcf", "Flujo neto de efectivo (recursos propios)", "MXN", "RENTA / Flujo"),
]

# INDICADORES_INFO: {clave en r['kpi']: (indicador, unidad, referencia en el Excel)}
INDICADORES_INFO = {
    "tir": ("TIR del proyecto (mensual anualizada)", "%", "RENTA"),
    "vpn": ("VPN a la tasa de descuento", "MXN", "RENTA"),
    "vpn_rp": ("VPN, recursos propios", "MXN", "RENTA"),
    "roi_promedio": ("ROI promedio anual, años 1-20", "%", "RENTA"),
    "roi_acumulado": ("ROI acumulado", "veces", "RENTA"),
    "payback": ("Payback, desde ene-27", "años", "RENTA"),
    "payback_con_intereses": ("Payback con intereses, desde ene-27", "años", "RENTA"),
    "payback_con_intereses_rp": ("Payback con intereses, recursos propios", "años", "RENTA"),
    "periodo_cero_meses": ("Periodo preoperativo", "meses", "RENTA: periodo cero"),
    "utilidad_por_kwh": ("Utilidad neta por kWh", "MXN/kWh", "RENTA"),
    "flujo_por_kwh": ("Flujo neto por kWh", "MXN/kWh", "RENTA"),
    "costo_unitario_kva": ("Costo de inversión por kVA instalado", "MXN/kVA", "RENTA"),
    "precio_unitario_kva": ("Precio del derecho de uso por kVA, 2027", "MXN/kVA", "RENTA"),
    "pico_capital": ("Necesidad máxima acumulada de flujo del proyecto", "MXN", "Flujo"),
    "mes_pico": ("Mes de la necesidad máxima", "mes", "Flujo"),
    "ingresos_total": ("Ingresos acumulados", "MXN", "RENTA"),
    "un_total": ("Utilidad neta acumulada", "MXN", "RENTA"),
    "flujo_total": ("Flujo neto acumulado", "MXN", "RENTA"),
    "ing_kva_total": ("Ingresos por derechos de uso", "MXN", "RENTA"),
    "capex": ("Inversión (CAPEX)", "MXN", "Mensualizacion"),
    "fees_akredita": ("Comisiones de Akredita Me, 20 años", "MXN", "RENTA"),
    "mes_fin_venta": ("Mes de cierre de la colocación de kVA", "mes", "Mensualizacion"),
    "gwh_anual_pleno": ("Energía anual a capacidad plena", "GWh", "Mensualizacion"),
    "financiamiento_requerido": ("Financiamiento bancario", "MXN", "Flujo"),
    "cobertura_servicio_deuda": ("Cobertura mínima del servicio de deuda", "veces", "Flujo"),
    "horizonte_deuda_meses": ("Horizonte de la deuda", "meses", "Flujo"),
    "tir_sin_deuda": ("TIR del proyecto sin deuda", "%", "RENTA"),
}


# =====================================================================================================
# 3. UTILERÍAS
# =====================================================================================================
def reshape_sales(factor, total=100000.0, base=BASE_SALES):
    """Estira (factor>1) o comprime (factor<1) el calendario de colocación, conservando el mes de arranque y el total."""
    nz = np.nonzero(base)[0]; start, end = nz[0] + 1, nz[-1] + 1
    dur = end - start + 1
    new_dur = max(1, int(round(dur * factor)))
    src = np.concatenate([[0], np.cumsum(base)[start - 1: start - 1 + dur]]) / base.sum()
    cum_new = np.interp(np.arange(0, new_dur + 1) / new_dur, np.arange(0, dur + 1) / dur, src) * total
    s = np.zeros(N); s[start - 1: min(N, start - 1 + new_dur)] = np.diff(cum_new)[: N - start + 1]
    return s


def mes_label(m):
    return ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][(m - 1) % 12] + "-" + str(ANIO_INICIAL + (m - 1) // 12)[2:]


def _indice_inflacion(p, year):
    inf = p["inflacion"]
    if np.isscalar(inf):
        return (1 + inf) ** (year - ANIO_INICIAL)
    tasas = list(inf) + [inf[-1]] * 30
    acc = np.cumprod([1.0] + [1 + tasas[k] for k in range(1, 30)])   # tasa[0] = 2027 (base)
    return acc[year - ANIO_INICIAL]


# =====================================================================================================
# 4. MODELO MENSUAL
# =====================================================================================================
def run(ritmo=None, sobrecosto=None, **over):
    """Corre el modelo mensual. `ritmo` (factor del calendario de colocación) y `sobrecosto` (% sobre CAPEX) son atajos."""
    p = copy.deepcopy(DEFAULT); p.update(over)
    if ritmo is not None and ritmo != 1.0:
        p["sales"] = reshape_sales(ritmo)
    if sobrecosto:
        p["capex_factor"] = 1.0 + sobrecosto
    t = np.arange(1, N + 1)
    year = ANIO_INICIAL + (t - 1) // 12
    idx = _indice_inflacion(p, year)
    cod = p["mes_cod"]

    # ---- Inversión
    items = p["capex_partidas"] or CAPEX_ITEMS
    capex_items = {k: np.asarray(v, dtype=float) * p["capex_factor"] for k, v in items.items()}
    capex_m = sum(capex_items.values())
    capex_tot = capex_m.sum()

    # ---- Derechos de uso
    sales = np.asarray(p["sales"], dtype=float)
    precio_kva = np.where(t >= p["mes_inicio_precio"], p["precio_kva_2027"] * idx, 0.0)
    ing_kva = precio_kva * sales

    # ---- Capacidad y energía
    act = np.zeros(N); cap = 0.0; nueva = np.zeros(N)
    for i in range(N):
        m = i + 1
        prev = cap
        if m == cod:
            cap = min(p["activacion_inicial"], p["capacidad_total"])
        elif m > cod:
            cap = min(cap + p["activacion_mensual"], p["capacidad_total"])
        act[i] = cap if m < cod + p["vida_meses"] else 0.0
    if p["activa_solo_vendido"]:
        act = np.minimum(act, np.cumsum(sales))
    nueva[1:] = np.maximum(np.diff(act), 0); nueva[0] = act[0]
    kwh = act * p["horas_mes"] * p["factor_energia"]
    costo_kwh = np.where(act > 0, p["costo_cfe_2027"] * idx, 0)
    precio_kwh = np.where(act > 0, p["precio_mt_2027"] * idx, 0)
    ing_kwh = kwh * precio_kwh
    ingresos = ing_kva + ing_kwh

    # ---- Egresos
    oper = act > 0
    costo_e = kwh * costo_kwh
    mant = np.where(oper, p["mant_mes_2027"] * idx, 0)
    subm = np.where(oper, p["submed_mes_2027"] * idx, 0)
    pm = np.where(oper, p["project_manager_mes_2027"] * idx, 0)
    seguro = np.where(oper, p["seguro_pct"] * capex_tot / 12 * idx, 0)
    fee_adm = p["fee_admin"] * ingresos
    exito = np.zeros(N); exito[0] = p["comision_exito"] * capex_tot
    fee_lev = p["fee_levantamiento"] * capex_m * idx   # el archivo indexa la razón por inflación
    egresos = costo_e + mant + subm + seguro + fee_adm + exito + fee_lev + pm

    # ---- Depreciación por partida (línea recta desde el inicio de operación)
    dep = np.zeros(N); dep_items = {}
    for k, v in capex_items.items():
        vida = (p["vida_partidas"] or {}).get(k, p["vida_meses"])
        d = np.zeros(N); d[cod - 1: cod - 1 + vida] = v.sum() / vida
        dep_items[k] = d; dep += d

    # ---- Gasto corporativo y utilidad directa operativa
    pre = ingresos - egresos - dep
    gcorp = np.maximum(pre, 0) * p["gasto_corp"]
    udo = pre - gcorp

    # ---- Financiamiento bancario
    disp = np.zeros(N); pago = np.zeros(N); saldo = np.zeros(N); interes = np.zeros(N); comision = np.zeros(N); prima = np.zeros(N)
    if p["credito_monto"] > 0:
        md = p["credito_mes_disposicion"]; disp[md - 1] = p["credito_monto"]; comision[md - 1] = p["credito_monto"] * p["credito_comision_apertura"]
        ini = md + p["credito_gracia_meses"]; cuota = p["credito_monto"] / p["credito_plazo_meses"]
        s_prev = 0.0
        for i in range(N):
            m = i + 1
            interes[i] = s_prev * p["credito_tasa"] / 12
            prima[i] = s_prev * p["credito_prima_cobertura"] / 12
            s = s_prev + disp[i]
            if ini < m <= ini + p["credito_plazo_meses"]:
                pago[i] = min(cuota, s)
            s -= pago[i]; saldo[i] = s; s_prev = s
    # ---- Préstamo intercompañías (Akredita Me -> Operadora): se dispone al ritmo de los usos; interés mensual;
    #      amortización lineal desde el inicio de operación. El interés es deducible en la Operadora.
    iva_com = (exito + fee_lev) * p["iva"] if p["iva_comisiones"] else np.zeros(N)
    usos = capex_m + capex_m * p["iva"] + exito + fee_lev + iva_com
    ic_disp = usos * p["prestamo_ic_pct"]; ic_int = np.zeros(N); ic_pago = np.zeros(N); ic_saldo = np.zeros(N)
    if p["prestamo_ic_pct"] > 0:
        s_prev = 0.0; tot = ic_disp.sum(); cuota_ic = tot / max(p["prestamo_ic_plazo_meses"], 1)
        for i in range(N):
            m = i + 1
            ic_int[i] = s_prev * p["prestamo_ic_tasa"] / 12
            s_ = s_prev + ic_disp[i]
            if m >= cod:
                ic_pago[i] = min(cuota_ic, s_)
            s_ -= ic_pago[i]; ic_saldo[i] = s_; s_prev = s_
    financ = interes + comision + prima + ic_int
    uai = udo - financ

    # ---- Reforma LISR 2027 (opcional): tope global de deducciones
    extra = np.zeros(N); rem = 0.0
    if p["tope_deducciones"]:
        ded_m = egresos + dep + gcorp + financ
        for y in range(ANIO_INICIAL, ANIO_INICIAL + 22):
            msk = np.where(year == y)[0]
            I_y = ingresos[msk].sum(); D_y = ded_m[msk].sum(); Dtot = D_y + rem
            exento = p["excepcion_5_ejercicios"] and y < ANIO_INICIAL + 5
            permitida = Dtot
            if I_y > 50e6 and I_y - Dtot > 0 and not exento:
                permitida = 0.99 * Dtot if Dtot <= 0.9667 * I_y else 0.9667 * I_y
            rem = (Dtot - permitida) if p["remanente_recuperable"] else 0.0
            extra[msk] = (D_y - permitida) / len(msk)
    base_fiscal = uai + extra

    # ---- PTU (acumulada por ejercicio, pagada en mayo del año siguiente) e ISR
    ptu = np.zeros(N); ptu_pay = np.zeros(N)
    for y in range(ANIO_INICIAL, ANIO_INICIAL + 22):
        msk = np.where(year == y)[0]; acc_u = 0.0; acc_p = 0.0
        for i in msk:
            acc_u += base_fiscal[i]; target = max(acc_u, 0) * p["ptu"]
            ptu[i] = target - acc_p; acc_p = target
        pay_i = (y + 1 - ANIO_INICIAL) * 12 + 4
        if pay_i < N:
            ptu_pay[pay_i] = acc_p
    isr = (base_fiscal - ptu) * p["isr"]
    un = uai - ptu - isr

    # ---- Flujo de efectivo
    iva_inv = capex_m * p["iva"]
    iva_dev = np.zeros(N)
    if p["iva_recuperable"]:
        lag = p["meses_devolucion_iva"]; iva_dev[lag:] = iva_inv[: N - lag]
    adj_isr = np.zeros(N); saldo_isr = 0.0
    for i in range(N):
        a = 0.0
        if isr[i] < 0:
            a -= -isr[i]; saldo_isr += -isr[i]        # ISR a favor: no es entrada de efectivo
        elif saldo_isr > 0:
            use = min(saldo_isr, isr[i]); a += use; saldo_isr -= use   # compensación
        adj_isr[i] = a
    flujo_operacion = un + dep + adj_isr + ptu - ptu_pay
    fcf = flujo_operacion - capex_m - iva_inv + iva_dev - iva_com + disp - pago   # FLUJO NETO DE EFECTIVO (Recursos Propios)
    fcf_sin_deuda = fcf - disp + pago + financ * (1 - p["isr"])            # flujo del proyecto antes de financiamiento
    # El préstamo intercompañías es parte de la aportación de los inversionistas: no altera el flujo del proyecto,
    # solo la forma de retorno (intereses deducibles y amortización sin efecto del art. 78).

    r = dict(p=p, t=t, year=year, idx=idx,
             precio_kva=precio_kva, sales=sales, nueva_capacidad=nueva, act=act, kwh=kwh, costo_kwh=costo_kwh, precio_kwh=precio_kwh,
             ing_kva=ing_kva, ing_kwh=ing_kwh, ingresos=ingresos,
             costo_e=costo_e, mant=mant, subm=subm, seguro=seguro, fee_adm=fee_adm, exito=exito, fee_lev=fee_lev, pm=pm, egresos=egresos,
             capex_items=capex_items, capex_m=capex_m, capex_tot=capex_tot, dep_items=dep_items, dep=dep,
             gcorp=gcorp, udo=udo, disp=disp, pago=pago, saldo=saldo, ic_disp=ic_disp, ic_int=ic_int, ic_pago=ic_pago, ic_saldo=ic_saldo, interes=interes, comision=comision, prima=prima, financ=financ,
             uai=uai, extra_base=extra, ptu=ptu, ptu_pay=ptu_pay, isr=isr, un=un,
             iva_inv=iva_inv, iva_dev=iva_dev, iva_com=iva_com, adj_isr=adj_isr, flujo_operacion=flujo_operacion, fcf=fcf, fcf_sin_deuda=fcf_sin_deuda)
    r["anual"] = {k: anual(r, r[k]) for k in ["fcf", "ingresos", "ing_kva", "ing_kwh", "costo_e", "un", "uai", "egresos", "capex_m",
                                              "isr", "ptu", "dep", "gcorp", "iva_inv", "flujo_operacion", "financ", "kwh"]}
    r["anual"]["capex"] = r["anual"]["capex_m"]
    r["anual"]["fee_adm"] = anual(r, fee_adm)
    r["anual"]["opex"] = anual(r, mant + subm + seguro + pm)
    r["anual"]["ajuste_isr_ptu"] = anual(r, adj_isr + ptu - ptu_pay)
    r["anual"]["exito_lev"] = anual(r, exito + fee_lev)
    r["anual"]["iva_com"] = anual(r, iva_com)
    r["capital"] = dict(capex=capex_tot, iva=iva_inv.sum() - iva_dev.sum(), comisiones=(exito + fee_lev).sum(), iva_comisiones=iva_com.sum())
    r["capital"]["total"] = r["capital"]["capex"] + r["capital"]["iva"] + r["capital"]["comisiones"] + r["capital"]["iva_comisiones"]
    r["kpi"] = kpis(r)
    return r


def anual(r, v):
    """Agrega una serie mensual con el criterio del archivo: Año 0 = meses 1..cod-1; Año k = 12 meses."""
    c0 = r["p"]["mes_cod"] - 1; v = np.asarray(v, dtype=float)
    return np.array([v[:c0].sum()] + [v[c0 + 12 * k: (c0 + 12 * (k + 1)) if k < 19 else len(v)].sum() for k in range(20)])


# =====================================================================================================
# 5. INDICADORES (RENTA: Razones financieras)
# =====================================================================================================
def _payback(flujos, desc=None):
    f = np.asarray(flujos, dtype=float)
    if desc is not None:
        f = f / (1 + desc) ** (np.arange(len(f)) / 12)
    c = np.cumsum(f)
    if not (c >= 0).any() or c[-1] < 0:
        return None
    k = int(np.argmax(c >= 0))
    return (k + (-c[k - 1] / f[k] if k > 0 else 0)) / 12


def _tir_mensual(f):
    try:
        v = npf.irr(f)
        return (1 + v) ** 12 - 1 if v is not None and np.isfinite(v) else None
    except Exception:
        return None


def kpis(r):
    p = r["p"]; f = r["fcf"] + r["ic_int"]; t = r["t"]; a = r["anual"]
    vpn = (f / (1 + p["tasa_desc"]) ** ((t - 1) / 12)).sum()
    vpn_rp = (f / (1 + p["tasa_desc_rp"]) ** ((t - 1) / 12)).sum()
    den_roi = r["capex_tot"] + a["egresos"][0]
    roi = a["fcf"] / den_roi
    cum = np.cumsum(f)
    serv = anual(r, r["pago"] + r["interes"] + r["comision"] + r["prima"])
    antes_serv = a["fcf"] + anual(r, r["pago"] - r["disp"] + r["interes"] + r["comision"] + r["prima"])
    dscr = [antes_serv[k] / serv[k] for k in range(1, 21) if serv[k] > 0]   # años de operación
    sal = np.nonzero(r["saldo"] > 1.0)[0]
    kwh = r["kwh"].sum()
    return dict(
        tir=_tir_mensual(f), vpn=vpn, vpn_rp=vpn_rp, tir_sin_deuda=_tir_mensual(r["fcf_sin_deuda"]),
        roi_anual=roi.tolist(), roi_promedio=roi[1:].mean(), roi_acumulado=roi[1:].sum(),
        payback=_payback(f), payback_con_intereses=_payback(f, p["tasa_desc"]), payback_con_intereses_rp=_payback(f, p["tasa_desc_rp"]),
        periodo_cero_meses=p["mes_cod"] - 1,
        utilidad_por_kwh=r["un"].sum() / kwh if kwh else None, flujo_por_kwh=f.sum() / kwh if kwh else None,
        costo_unitario_kva=r["capex_tot"] / p["capacidad_total"], precio_unitario_kva=p["precio_kva_2027"],
        financiamiento_requerido=p["credito_monto"], cobertura_servicio_deuda=min(dscr) if dscr else None,
        horizonte_deuda_meses=int(sal[-1] + 1 - sal[0]) if len(sal) else None,
        pico_capital=-cum.min(), mes_pico=int(cum.argmin()) + 1,
        flujo_total=f.sum(), ingresos_total=r["ingresos"].sum(), un_total=r["un"].sum(), ing_kva_total=r["ing_kva"].sum(),
        capex=r["capex_tot"], fees_akredita=(r["fee_adm"] + r["exito"] + r["fee_lev"]).sum(),
        mes_fin_venta=int(np.nonzero(r["sales"])[0][-1]) + 1 if r["sales"].any() else None,
        gwh_anual_pleno=p["capacidad_total"] * p["horas_mes"] * p["factor_energia"] * 12 / 1e6,
    )


# =====================================================================================================
# 6. ESTRUCTURA DE INVERSIÓN: Akredita Me / Fideicomiso OPE-I / Operadora (90% Akredita Me, 10% socios fundadores)
# =====================================================================================================
POLITICAS = {
    "capital_primero": "Primero disminución de capital",
    "mixta": "Mixta: año 1 % a capital; después kVA / %",
    "tope_fiscal": "Mixta con tope fiscal (CUCA y CUFIN)",
    "depreciacion": "Disminución en 20 años, en línea con la depreciación",
    "dividendos_primero": "Primero dividendos",
}

# Perfiles por apetito de riesgo del inversionista: forma de aportación (capital / préstamo intercompañías),
# política de distribución y salvaguardas. Las claves 'prestamo_ic_*' se aplican al modelo (run); el resto al motor.
PERFILES = {
    "Conservador": dict(prestamo_ic_pct=0.50, prestamo_ic_tasa=0.10, prestamo_ic_plazo_meses=36,
                        politica="tope_fiscal", pct_capital=0.50, reserva_legal=True, caja_minima_meses=1.0,
                        descripcion="50% de la aportación como préstamo intercompañías amortizable en 3 años desde el inicio de operación; "
                                    "el capital se devuelve dentro de lo que cubren la CUCA y la CUFIN. Recuperación prioritaria."),
    "Balanceado": dict(prestamo_ic_pct=0.30, prestamo_ic_tasa=0.10, prestamo_ic_plazo_meses=60,
                       politica="tope_fiscal", pct_capital=0.50, reserva_legal=True, caja_minima_meses=1.0,
                       descripcion="30% como préstamo intercompañías amortizable en 5 años; resto en capital con tope fiscal."),
    "Fiscal optimizado": dict(prestamo_ic_pct=0.0, politica="tope_fiscal", pct_capital=0.50, reserva_legal=True, caja_minima_meses=1.0,
                              descripcion="100% capital; dividendos y disminución de capital limitados a lo que cubren la CUFIN y la CUCA. Sin ISR por distribución."),
    "Patrimonial": dict(prestamo_ic_pct=0.0, politica="depreciacion", pct_capital=0.0, reserva_legal=True, caja_minima_meses=1.0,
                        descripcion="Opción base. 100% capital; disminución de capital en 20 años, en línea con la depreciación del activo (mecanismo por definir); horizonte de 20 años."),
    "Mixta sin tope (referencia)": dict(prestamo_ic_pct=0.0, politica="mixta", pct_capital=0.50, reserva_legal=True, caja_minima_meses=1.0,
                                        descripcion="Referencia: año 1, 50% de la caja a disminución de capital; después según la colocación de kVA. Con el efecto del art. 78 y salvaguardas."),
}
CLAVES_MODELO = ("prestamo_ic_pct", "prestamo_ic_tasa", "prestamo_ic_plazo_meses")


def inversionistas(r, part=0.90, politica="depreciacion", retencion=0.10, pct_capital=0.0,
                   reserva_legal=True, caja_minima_meses=1.0, art78=True, actualizar_cuca=True,
                   capital_ordinario_op=50000.0, acciones_ordinarias_op=50000.0,
                   capital_fundadores_akredita=50000.0, acciones_fundadores_akredita=50000.0, precio_accion_inversionistas=1.0,
                   isr_ak_interes=0.30):
    """Motor de distribuciones de la Operadora hacia Akredita Me (inversionistas) y los socios fundadores (10%, promote).

    Valores por omisión = opción base (perfil Patrimonial). La disminución de capital se modela en la Operadora y en
    Akredita Me, donde los inversionistas están registrados como accionistas; el mecanismo definitivo está por definir.

    Aportación: llamados de capital = 100% de CAPEX + IVA de la inversión + comisiones de estructuración, como capital de
    Akredita Me en la Operadora (precio por acción `precio_accion_inversionistas`).

    Cada trimestre desde el inicio de operación, con la caja disponible (descontadas la PTU por pagar y la caja mínima):
      'capital_primero'    disminución de capital hasta liquidar; después dividendos.
      'mixta'              año 1: pct_capital a capital y el resto a dividendos; después, a capital el mayor entre
                           ingresos por derechos de uso del periodo y pct_capital de la caja.
      'tope_fiscal'        igual que 'mixta', pero dividendos y disminución de capital se limitan a lo que cubren la CUFIN
                           y la CUCA (art. 78 LISR) en la Operadora y en Akredita Me; el excedente se retiene en caja.
      'depreciacion'       disminución de capital al ritmo de la depreciación del activo; el resto a dividendos.
      'dividendos_primero' dividendos hasta la utilidad distribuible; el remanente a capital.
    Dividendos: `part` a Akredita Me (se trasladan íntegros a los inversionistas) y 1 - part a socios fundadores (promote, sin
    aportación de capital).

    Salvaguardas y cuentas fiscales (aproximación para proyección; sujeta a validación fiscal):
      - Reserva legal: 5% de la utilidad del ejercicio hasta 20% del capital social (art. 20 LGSM) en la Operadora.
      - Caja mínima: `caja_minima_meses` de egresos operativos promedio retenidos en la Operadora.
      - CUFIN (Operadora): se incrementa al cierre de cada ejercicio con la utilidad fiscal neta (base fiscal - PTU - ISR).
      - CUCA: aportaciones menos reembolsos, actualizada por inflación si `actualizar_cuca`.
      - Art. 78: utilidad distribuida por reducción de capital = excedente del reembolso sobre CUCA por acción (UD1, dividendo)
        más la diferencia capital contable - CUCA por acción de las acciones canceladas (UD2).
      - Distribuciones (dividendos, UD1, UD2) que excedan la CUFIN causan ISR art. 10 (30% sobre monto x 1.4286), acreditable
        contra el ISR de los dos ejercicios siguientes (se recupera como menor ISR pagado).
      - En Akredita Me: CUFIN = dividendos recibidos; la disminución de capital de los inversionistas usa la CUCA por acción de toda la
        sociedad (inversionistas + acciones de los socios fundadores); el excedente (UD1) es dividendo para el inversionista."""
    p = r["p"]; fcf = r["fcf"]; n = len(fcf); inicio = p["mes_cod"]
    infl_m = (1 + (p["inflacion"] if np.isscalar(p["inflacion"]) else np.mean(p["inflacion"]))) ** (1 / 12) - 1
    usos = r["capex_m"] + r["iva_inv"] + r["exito"] + r["fee_lev"] + r["iva_com"]
    calls = usos - r["ic_disp"]                 # aportación a capital (el resto entra como préstamo intercompañías)
    calls_tot = calls.sum(); dep_tot = r["dep"].sum()
    ptu_x_pagar = np.cumsum(r["ptu"]) - np.cumsum(r["ptu_pay"])
    ufin_m = (r["uai"] + r["extra_base"]) - r["ptu"] - r["isr"]
    gasto_m = r["egresos"] - r["exito"] - r["fee_lev"]
    acc_f_op = acciones_ordinarias_op          # acciones ordinarias de la Operadora (90% Akredita Me / 10% socios fundadores)
    acc_A = acciones_fundadores_akredita                # acciones de los socios fundadores en Akredita Me
    usa_tope = politica == "tope_fiscal"

    caja = 0.0; util = 0.0; reserva = 0.0; util_ej = 0.0
    cap_social = capital_ordinario_op; acciones_inv = 0.0; cuca = capital_ordinario_op; cufin = 0.0; ufin_ej = 0.0
    cap_pend = 0.0; kva_per = 0.0; dep_per = 0.0; rezago = 0.0
    credito_art10 = []                     # [(monto, mes_vencimiento)]
    cuca_ak = capital_fundadores_akredita; acc_ak = acc_A; acciones_inv_ak = 0.0; cufin_ak = 0.0
    S = {k: np.zeros(n) for k in ["div", "red", "caja", "isr_art10", "credito_aplicado", "ud1", "ud2", "cufin", "cuca", "reserva",
                                  "cc", "ud1_ak", "isr_art10_ak", "cufin_ak", "cuca_ak", "retenido"]}
    for i in range(n):
        m = i + 1
        cuca *= (1 + infl_m) if actualizar_cuca else 1.0
        cuca_ak *= (1 + infl_m) if actualizar_cuca else 1.0
        # aportaciones (llamado de capital) y flujo del mes
        caja += fcf[i] + calls[i] + r["ic_disp"][i] - r["ic_pago"][i]
        cap_social += calls[i]; acciones_inv += calls[i] / precio_accion_inversionistas; cuca += calls[i]; cap_pend += calls[i]
        cuca_ak += calls[i]; acciones_inv_ak += calls[i] / precio_accion_inversionistas; acc_ak += calls[i] / precio_accion_inversionistas
        util += r["un"][i]; util_ej += r["un"][i]; ufin_ej += ufin_m[i]
        dep_per += r["dep"][i]
        if m >= inicio:
            kva_per += r["ing_kva"][i]
        # acreditamiento del ISR art. 10 contra el ISR del mes (dentro de 24 meses)
        if credito_art10 and r["isr"][i] > 0:
            disp_isr = r["isr"][i]; nuevo = []
            for monto, vence in credito_art10:
                if m <= vence and disp_isr > 0:
                    use = min(monto, disp_isr); disp_isr -= use; monto -= use; caja += use; S["credito_aplicado"][i] += use
                if monto > 1e-6 and m <= vence:
                    nuevo.append((monto, vence))
            credito_art10 = nuevo
        # cierre de ejercicio: CUFIN y reserva legal
        if m % 12 == 0:
            cufin += max(ufin_ej, 0.0); ufin_ej = 0.0
            if reserva_legal and util_ej > 0:
                aport = min(0.05 * util_ej, max(0.20 * cap_social - reserva, 0.0)); reserva += aport
            util_ej = 0.0
        ultimo = i == n - 1
        if (m >= inicio and m % 3 == 0) or ultimo:
            caja_min = 0.0 if ultimo else caja_minima_meses * gasto_m[max(0, i - 11): i + 1].mean()
            disp = max(caja - (0 if ultimo else max(ptu_x_pagar[i], 0)) - caja_min, 0.0)
            if reserva_legal and reserva > 0.20 * cap_social:          # liberación de reserva excedente tras reducciones
                reserva = 0.20 * cap_social
            util_dist = max(util - reserva, 0.0) if not ultimo else max(util, 0.0)
            N_op = acciones_inv + acc_f_op

            def ud_por_reduccion(c, d):
                """UD1 y UD2 (art. 78 LISR) por cancelar acciones de los inversionistas en Akredita Me por un reembolso c,
                después de decretar dividendos d en el mismo evento."""
                if c <= 0 or not art78:
                    return 0.0, 0.0
                n_canc = c / precio_accion_inversionistas
                cc = cap_social + util - d
                ud1 = max(c - cuca / N_op * n_canc, 0.0)
                ud2 = max((cc - cuca) / N_op * n_canc - ud1, 0.0)
                return ud1, ud2

            def ud_akredita(c):
                if c <= 0 or not art78:
                    return 0.0
                return max(c - cuca_ak / acc_ak * (c / precio_accion_inversionistas), 0.0)

            # --- objetivos según la política (dividendos se decretan antes de la reducción en cada evento)
            if ultimo:
                c = min(disp, cap_pend); d = min(disp - c, util_dist)
            else:
                if politica in ("mixta", "tope_fiscal"):
                    anio1 = m < inicio + 12
                    meta_c = pct_capital * disp if anio1 else max(pct_capital * disp, kva_per)
                elif politica == "capital_primero":
                    meta_c = disp
                elif politica == "depreciacion":
                    meta_c = calls_tot * dep_per / dep_tot + rezago if dep_tot else 0.0
                else:
                    meta_c = 0.0
                if politica == "dividendos_primero":
                    d = min(disp, util_dist); c = min(disp - d, cap_pend)
                else:
                    c = min(meta_c, cap_pend, disp); d = min(disp - c, util_dist)
                    if politica in ("mixta", "capital_primero") and disp - c - d > 0:
                        c += min(disp - c - d, cap_pend - c)
                if usa_tope:
                    d = min(disp, util_dist, max(cufin, 0.0))               # dividendos cubiertos por CUFIN
                    cufin_rest = max(cufin - d, 0.0); cufin_ak_disp = cufin_ak + d * part
                    c_obj = min(max(meta_c, disp - d), cap_pend, disp - d)
                    lo, hi = 0.0, c_obj
                    for _ in range(40):
                        mid = (lo + hi) / 2; u1_, u2_ = ud_por_reduccion(mid, d)
                        if u1_ + u2_ <= cufin_rest + 1e-6 and ud_akredita(mid) <= max(cufin_ak_disp - d * part, 0.0) + 1e-6:
                            lo = mid
                        else:
                            hi = mid
                    c = lo
                if politica == "depreciacion":
                    rezago = max(meta_c - c, 0.0)
            # --- art. 78 en la Operadora e ISR art. 10; d y c se ajustan para que el ISR quepa en la caja disponible
            def costo(esc):
                u1_, u2_ = ud_por_reduccion(c * esc, d * esc)
                ex = max(d * esc + u1_ + u2_ - max(cufin, 0.0), 0.0)
                return u1_, u2_, ex * 0.30 * 1.4286
            u1, u2, isr10 = costo(1.0)
            if d + c + isr10 > disp + 1e-6:
                lo, hi = 0.0, 1.0
                for _ in range(40):
                    mid = (lo + hi) / 2
                    if d * mid + c * mid + costo(mid)[2] <= disp:
                        lo = mid
                    else:
                        hi = mid
                d *= lo; c *= lo; u1, u2, isr10 = costo(1.0)
            distrib = d + u1 + u2
            cufin = max(cufin - distrib, 0.0)
            caja -= d + c + isr10
            if isr10 > 0:
                credito_art10.append((isr10, m + 24))
            cap_social -= c; acciones_inv -= c / precio_accion_inversionistas; cuca = max(cuca - (c - u1), 0.0)
            util -= d; cap_pend -= c
            # --- Akredita Me: recibe dividendos (90%) y reembolso; los traslada a los inversionistas
            cufin_ak += d * part
            u1_ak = 0.0
            if c > 0 and art78:
                n_ak = c / precio_accion_inversionistas
                u1_ak = max(c - cuca_ak / acc_ak * n_ak, 0.0)
                cuca_ak = max(cuca_ak - (c - u1_ak), 0.0); acc_ak -= n_ak
            exceso_ak = max(d * part + u1_ak - cufin_ak, 0.0)
            isr10_ak = exceso_ak * 0.30 * 1.4286
            cufin_ak = max(cufin_ak - d * part - u1_ak, 0.0)
            S["div"][i] = d; S["red"][i] = c; S["isr_art10"][i] = isr10; S["ud1"][i] = u1; S["ud2"][i] = u2
            S["ud1_ak"][i] = u1_ak; S["isr_art10_ak"][i] = isr10_ak
            kva_per = 0.0; dep_per = 0.0
        S["caja"][i] = caja; S["cufin"][i] = cufin; S["cuca"][i] = cuca; S["reserva"][i] = reserva; S["cc"][i] = cap_social + util
        S["cufin_ak"][i] = cufin_ak; S["cuca_ak"][i] = cuca_ak

    div_inv = part * S["div"]; div_soc = (1 - part) * S["div"]
    # Préstamo intercompañías: Akredita Me recibe intereses (ISR 30% en Akredita) y amortizaciones; los traslada a los inversionistas
    isr_ic = isr_ak_interes * r["ic_int"]
    int_neto = r["ic_int"] - isr_ic
    # Flujo al inversionista: dividendos + reembolso + préstamo - ISR art. 10 de Akredita; retención sobre la parte dividendo
    pase = div_inv + S["red"] - S["isr_art10_ak"] + int_neto + r["ic_pago"]
    aport = calls + r["ic_disp"]
    flujo = -aport + pase
    flujo_net = -aport + pase - retencion * (div_inv + S["ud1_ak"] + int_neto)
    def tir(v):
        return _tir_mensual(v)
    cum = np.cumsum(flujo); k = int(np.argmax(cum >= 0)) if (cum >= 0).any() else None
    cr = np.cumsum(S["red"] + r["ic_pago"]); tot_ap = aport.sum()
    liq = int(np.argmax(cr >= tot_ap - 1)) + 1 if cr[-1] >= tot_ap - 1 else None
    caja_min_hist = S["caja"][inicio - 1:].min()
    out = dict(calls=aport, calls_capital=calls, prestamo=r["ic_disp"].sum(), intereses_ic=r["ic_int"].sum(), isr_intereses_ic=isr_ic.sum(),
               div=S["div"], div_inv=div_inv, div_soc=div_soc, red=S["red"], caja=S["caja"], flujo=flujo, flujo_neto=flujo_net,
               tir=tir(flujo), tir_neta=tir(flujo_net), capital=tot_ap, capital_devuelto=S["red"].sum() + r["ic_pago"].sum(), capital_pendiente=cap_pend,
               caja_final=caja, dividendos_inv=div_inv.sum(), dividendos_socios=div_soc.sum(),
               mom=pase.sum() / tot_ap, payback=(k / 12) if k is not None else None, mes_liquidacion=liq,
               isr_art10=S["isr_art10"].sum(), isr_art10_neto=S["isr_art10"].sum() - S["credito_aplicado"].sum(),
               isr_art10_ak=S["isr_art10_ak"].sum(), ud_art78=(S["ud1"] + S["ud2"]).sum(), ud1_akredita=S["ud1_ak"].sum(),
               retencion_total=retencion * (div_inv + S["ud1_ak"] + int_neto).sum(), reserva_legal=reserva, caja_min_operacion=caja_min_hist,
               series=S, politica=politica,
               anual=dict(calls=anual(r, aport), div_inv=anual(r, div_inv), div_soc=anual(r, div_soc), red=anual(r, S["red"]),
                          prestamo_pago=anual(r, r["ic_pago"]), intereses_netos=anual(r, int_neto),
                          isr_art10=anual(r, S["isr_art10"]), credito_art10=anual(r, S["credito_aplicado"]),
                          ud78=anual(r, S["ud1"] + S["ud2"]), retencion=anual(r, retencion * (div_inv + S["ud1_ak"] + int_neto))))
    for nombre, idx_ in [("cufin", "cufin"), ("cuca", "cuca"), ("reserva", "reserva"), ("caja", "caja"), ("cufin_ak", "cufin_ak"), ("cuca_ak", "cuca_ak")]:
        v = S[idx_]; c0 = inicio - 1
        out["anual"][nombre + "_cierre"] = np.array([v[c0 - 1]] + [v[min(n - 1, c0 + 12 * (kk + 1) - 1)] for kk in range(20)])
    return out


def resumen_inversionista(inv):
    a = inv["anual"]
    return dict(tir=inv["tir"], tir_neta=inv["tir_neta"], payback=inv["payback"], mom=inv["mom"],
                liquidacion=mes_label(inv["mes_liquidacion"]) if inv["mes_liquidacion"] else "no se completa",
                capital_devuelto_a5=(np.sum(a["red"][:6]) + np.sum(a["prestamo_pago"][:6])) / inv["capital"], dividendos_inv_a1_5=np.sum(a["div_inv"][1:6]),
                dividendos_socios_a1_5=np.sum(a["div_soc"][1:6]), dividendos_inv_20=inv["dividendos_inv"],
                isr_art10=inv["isr_art10"], isr_art10_neto=inv["isr_art10_neto"] + inv["isr_art10_ak"], retenciones=inv["retencion_total"],
                cuca_a5=a["cuca_cierre"][5], cufin_a5=a["cufin_cierre"][5])


def comparar_perfiles(params_modelo=None, perfiles=None, **comun):
    """Corre cada perfil sobre el mismo escenario (params_modelo para run) y regresa {perfil: (r, inversionistas, resumen)}."""
    res = {}
    for nombre, cfg in (perfiles or PERFILES).items():
        pm = dict(params_modelo or {}); pm.update({k: v for k, v in cfg.items() if k in CLAVES_MODELO})
        kw = {k: v for k, v in cfg.items() if k not in CLAVES_MODELO and k != "descripcion"}; kw.update(comun)
        r = run(**pm)
        inv = inversionistas(r, **kw)
        res[nombre] = (r, inv, resumen_inversionista(inv))
    return res


def escenario(nombre, **over):
    """Corre un escenario predefinido (Pesimista, Base, Optimista) con cambios adicionales opcionales."""
    p = dict(ESCENARIOS[nombre]); p.update(over)
    return run(**p)


# =====================================================================================================
# 7. ESTADO DE RESULTADOS Y FLUJO ANUAL (formato RENTA)
# =====================================================================================================
def estado_resultados_anual(r):
    """Lista ordenada de (concepto, array anual Año 0..20) con los renglones de la hoja RENTA."""
    A = lambda k: anual(r, r[k])
    filas = [
        ("Derecho de uso (kVA colocados)", A("sales")),
        ("Capacidad activa al cierre (kVA)", np.array([r["act"][min(len(r["act"]) - 1, r["p"]["mes_cod"] - 2 + 12 * k)] if k else r["act"][r["p"]["mes_cod"] - 2] for k in range(21)])),
        ("Generación de energía (kWh)", A("kwh")),
        ("Ingreso por derechos de uso", A("ing_kva")),
        ("Ingreso por submedición", A("ing_kwh")),
        ("Total ingresos", A("ingresos")),
        ("Costo de energía", A("costo_e")),
        ("Opex mantenimiento subestación", A("mant")),
        ("Opex submedición", A("subm")),
        ("Prima de seguro de activos", A("seguro")),
        ("Fee de administración", A("fee_adm")),
        ("Comisión al éxito", A("exito")),
        ("Fee de levantamiento de capital", A("fee_lev")),
        ("Project manager", A("pm")),
        ("Total egresos", A("egresos")),
        *[(f"Inversión: {k}", anual(r, v)) for k, v in r["capex_items"].items()],
        ("Total inversión", A("capex_m")),
        ("Total depreciación", A("dep")),
        ("Gasto corporativo", A("gcorp")),
        ("Utilidad directa operativa", A("udo")),
        ("Comisión por apertura de crédito", A("comision")),
        ("Interés de crédito", A("interes")),
        ("Prima de cobertura T.C.", A("prima")),
        ("Total financiamiento", A("financ")),
        ("Utilidad antes de impuestos", A("uai")),
        ("PTU", A("ptu")),
        ("ISR", A("isr")),
        ("Utilidad neta", A("un")),
        ("IVA de la inversión", A("iva_inv")),
        ("Disposición de crédito", A("disp")),
        ("Pago de crédito", A("pago")),
        ("FLUJO NETO DE EFECTIVO (Recursos Propios)", A("fcf")),
        ("ROI", np.array(r["kpi"]["roi_anual"])),
    ]
    return filas


# =====================================================================================================
# 8. EXPORTACIÓN A EXCEL (auditoría)
# =====================================================================================================
def exportar_excel(r, ruta, inv=None):
    """Escribe Supuestos, Mensual, Anual, Indicadores e Inversionistas en un .xlsx."""
    from openpyxl import Workbook
    from openpyxl.styles import Font
    wb = Workbook(); b = Font(bold=True)
    ws = wb.active; ws.title = "Supuestos"
    ws.append(["Parámetro", "Valor"]); ws["A1"].font = ws["B1"].font = b
    for k, v in r["p"].items():
        if isinstance(v, (int, float, str, bool)) or v is None:
            ws.append([k, v])
    ws.append([]); ws.append(["Datos generales"])
    for k, v in DATOS_GENERALES.items():
        ws.append([k, v])
    ws = wb.create_sheet("Mensual")
    cols = ["sales", "precio_kva", "act", "kwh", "ing_kva", "ing_kwh", "ingresos", "costo_e", "mant", "subm", "seguro", "fee_adm", "exito",
            "fee_lev", "egresos", "capex_m", "dep", "gcorp", "udo", "financ", "uai", "ptu", "isr", "un", "iva_inv", "disp", "pago", "saldo", "fcf"]
    ws.append(["Mes", "Fecha"] + cols)
    for i in range(N):
        ws.append([i + 1, mes_label(i + 1)] + [float(r[c][i]) for c in cols])
    ws = wb.create_sheet("Anual")
    ws.append(["Concepto"] + [f"Año {k}" for k in range(21)] + ["Acumulado"])
    for nombre, arr in estado_resultados_anual(r):
        ws.append([nombre] + [float(x) for x in arr] + [float(np.sum(arr)) if nombre != "Capacidad activa al cierre (kVA)" else None])
    ws = wb.create_sheet("Indicadores")
    for k, v in r["kpi"].items():
        if not isinstance(v, list):
            ws.append([k, v])
    if inv is not None:
        ws = wb.create_sheet("Inversionistas")
        ws.append(["Concepto"] + [f"Año {k}" for k in range(21)])
        for k, nombre in [("calls", "Aportación de capital"), ("red", "Disminución de capital"), ("div_inv", "Dividendos a Akredita Me, inversionistas (90%)"), ("div_soc", "Dividendos a socios fundadores (10%, promote)")]:
            ws.append([nombre] + [float(x) for x in inv["anual"][k]])
        for k in ["capital", "capital_devuelto", "dividendos_inv", "tir", "tir_neta", "mom", "payback", "mes_liquidacion"]:
            ws.append([k, inv[k]])
    wb.save(ruta)
    return ruta


# =====================================================================================================
# 9. RESUMEN EN CONSOLA
# =====================================================================================================
def resumen(r, inv=None):
    k = r["kpi"]
    fmt = lambda x: "n/d" if x is None else x
    lineas = [
        f"TIR {k['tir']*100:.2f}%  |  VPN al {r['p']['tasa_desc']*100:.0f}% MXN {k['vpn']/1e6:,.1f} M  |  ROI promedio {k['roi_promedio']*100:.2f}%",
        f"Payback (desde ene-27) {fmt(k['payback']) if k['payback'] is None else round(k['payback'],1)} años  |  con intereses {fmt(k['payback_con_intereses']) if k['payback_con_intereses'] is None else round(k['payback_con_intereses'],1)} años  |  periodo preoperativo {k['periodo_cero_meses']} meses",
        f"Utilidad/Flujo por kWh {k['utilidad_por_kwh']:.2f} / {k['flujo_por_kwh']:.2f}  |  CAPEX MXN {k['capex']/1e6:,.1f} M  |  costo por kVA MXN {k['costo_unitario_kva']:,.0f}",
        f"Capital requerido MXN {r['capital']['total']/1e6:,.1f} M (CAPEX + IVA + comisiones)",
    ]
    if inv:
        lineas.append(f"Inversionistas: TIR {inv['tir']*100:.2f}% (neta {inv['tir_neta']*100:.2f}%), múltiplo {inv['mom']:.2f}x, "
                      f"devolución total proyectada en {mes_label(inv['mes_liquidacion']) if inv['mes_liquidacion'] else 'n/d'}")
    return "\n".join(lineas)


if __name__ == "__main__":
    for e in ESCENARIOS:
        r = escenario(e)
        print(f"== {e}\n" + resumen(r, inversionistas(r)))
