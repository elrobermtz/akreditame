"""
Simulador paramétrico — Operadora Energética I (OP1)
Ejecutar:  pip install -r requirements.txt
           streamlit run simulador_op1.py
Usa op1model.py (misma carpeta) como única fuente de cálculo del modelo.

Acceso: si se define APP_PASSWORD en .streamlit/secrets.toml (o la variable de entorno OP1_APP_PASSWORD),
el simulador pide contraseña antes de mostrar cualquier cifra. Si la autenticación la resuelve la infraestructura
propia (proxy, SSO), defina OP1_AUTH_EXTERNA=1 para ocultar el aviso de acceso sin contraseña.
"""
import hmac
import io
import os
import numpy as np
import pandas as pd
import altair as alt
import streamlit as st

import op1model as m

st.set_page_config(page_title="Simulador OP1", page_icon="⚡", layout="wide")
NAVY, GOLD, GREY = "#0B1F33", "#B8892B", "#9AA7B5"
AVISO = ("Estrictamente privado y confidencial. Las proyecciones se derivan del Modelo Financiero de Operadora Energética I y reflejan "
         "supuestos sobre eventos futuros; los escenarios son ilustrativos y no constituyen garantía de rendimiento. Este simulador no "
         "constituye una oferta pública de valores.")


# ------------------------------------------------------------------ acceso
def _clave_configurada():
    try:
        clave = st.secrets.get("APP_PASSWORD")
    except Exception:          # sin archivo de secretos
        clave = None
    return clave or os.environ.get("OP1_APP_PASSWORD")


def _acceso():
    clave = _clave_configurada()
    if not clave or st.session_state.get("acceso_ok"):
        return clave
    st.title("Simulador paramétrico — Operadora Energética I")
    st.caption(AVISO)
    with st.form("acceso"):
        intento = st.text_input("Contraseña", type="password")
        if st.form_submit_button("Entrar"):
            if hmac.compare_digest(intento.encode(), str(clave).encode()):
                st.session_state["acceso_ok"] = True
                st.rerun()
            st.error("Contraseña incorrecta.")
    st.stop()


_CLAVE = _acceso()


# ------------------------------------------------------------------ cálculo con caché
@st.cache_data(show_spinner=False)
def calcular(params: tuple, inv_params: tuple):
    p = dict(params); ip = dict(inv_params)
    r = m.run(**p)
    inv = m.inversionistas(r, **ip)
    return r, inv


def mm(x, d=2):
    return "n/d" if x is None else f"$ {x/1e6:,.{d}f}"


def pct(x, d=2):
    return "n/d" if x is None else f"{x*100:,.{d}f}%"


# ------------------------------------------------------------------ barra lateral
st.sidebar.title("Parámetros")
preset = st.sidebar.selectbox("Escenario de partida", ["Base", "Pesimista", "Optimista"], index=0)
P = dict(m.DEFAULT); P.update({k: v for k, v in m.ESCENARIOS[preset].items() if k != "ritmo"})
ritmo0 = m.ESCENARIOS[preset].get("ritmo", 1.0)
key = lambda n: f"{preset}_{n}"   # reinicia controles al cambiar de escenario

with st.sidebar.expander("Colocación de derechos de uso (kVA)", expanded=True):
    ritmo = st.slider("Ritmo de colocación (x duración del modelo)", 0.5, 2.5, float(ritmo0), 0.05, key=key("ritmo"),
                      help="1.0 = calendario del modelo (ago-27 a may-29); 1.5 = 50% más lento")
    precio_kva = st.number_input("Precio por kVA 2027 (MXN)", 3000.0, 15000.0, float(P["precio_kva_2027"]), 100.0, key=key("pkva"))
    capacidad = st.number_input("Capacidad total (kVA)", 10000.0, 400000.0, float(P["capacidad_total"]), 5000.0, key=key("cap"))

with st.sidebar.expander("Energía submedida", expanded=True):
    factor = st.slider("Factor de energía (carga y potencia)", 0.30, 0.95, float(P["factor_energia"]), 0.01, key=key("fe"),
                       help="kWh = kVA habilitados x 730 h x factor; incorpora el factor de carga y el factor de potencia.")
    precio_mt = st.number_input("Precio MT 2027 (MXN/kWh)", 1.0, 5.0, float(P["precio_mt_2027"]), 0.01, key=key("pmt"))
    costo_cfe = st.number_input("Costo CFE AT 2027 (MXN/kWh)", 1.0, 5.0, float(P["costo_cfe_2027"]), 0.01, key=key("cfe"))
    act_ini = st.number_input("Activación inicial (kVA)", 0.0, 400000.0, float(P["activacion_inicial"]), 5000.0, key=key("ai"))
    act_mes = st.number_input("Activación mensual (kVA)", 0.0, 100000.0, float(P["activacion_mensual"]), 1000.0, key=key("am"))

with st.sidebar.expander("Inversión y calendario"):
    sobrecosto = st.slider("Sobrecosto de CAPEX", -0.20, 0.50, 0.0, 0.01, key=key("sc"), format="%.2f")
    mes_cod = st.slider("Mes de inicio de operación (1 = ene-27)", 18, 36, int(P["mes_cod"]), 1, key=key("cod"))
    iva_rec = st.checkbox("IVA de la inversión recuperable", value=False, key=key("ivar"),
                          help="El caso base trata el IVA de la inversión como gasto: supuesto conservador, sin acreditamiento.")
    meses_iva = st.slider("Meses para devolución de IVA", 1, 24, 6, key=key("miva"), disabled=not iva_rec)
    inflacion = st.slider("Inflación anual", 0.0, 0.10, float(P["inflacion"]), 0.005, key=key("inf"), format="%.3f")

with st.sidebar.expander("Costos de operación"):
    mant = st.number_input("Mantenimiento subestación (MXN/mes, 2027)", 0.0, 10e6, float(P["mant_mes_2027"]), 50000.0, key=key("mant"))
    subm = st.number_input("Submedición (MXN/mes, 2027)", 0.0, 5e6, float(P["submed_mes_2027"]), 10000.0, key=key("subm"))
    seguro = st.slider("Seguro de activos (% anual del CAPEX)", 0.0, 0.05, float(P["seguro_pct"]), 0.001, key=key("seg"), format="%.3f")

with st.sidebar.expander("Comisiones de Akredita Me (administración)"):
    fee_admin = st.slider("Comisión de administración (% ingresos)", 0.0, 0.08, float(P["fee_admin"]), 0.005, key=key("fa"), format="%.3f")
    com_exito = st.slider("Comisión de éxito (% CAPEX)", 0.0, 0.10, float(P["comision_exito"]), 0.005, key=key("ce"), format="%.3f")

with st.sidebar.expander("Impuestos"):
    isr = st.slider("ISR", 0.0, 0.40, float(P["isr"]), 0.01, key=key("isr"))
    ptu = st.slider("PTU (tasa efectiva supuesta)", 0.0, 0.10, float(P["ptu"]), 0.01, key=key("ptu"),
                    help="La tasa legal es 10%, con tope de tres meses de salario; el modelo usa una tasa efectiva supuesta de 5%.")
    gcorp = st.slider("Gasto corporativo", 0.0, 0.05, float(P["gasto_corp"]), 0.005, key=key("gc"), format="%.3f")
    tope = st.checkbox("Aplicar posible reforma LISR 2027 (tope de deducciones)", value=False, key=key("tope"))
    exc5 = st.checkbox("Excepción por menos de 5 ejercicios", value=False, key=key("exc5"), disabled=not tope,
                       help="La Operadora se constituirá en 2027: la excepción cubriría 2027-2031, sujeta a las reglas antiabuso de la minuta.")
    remrec = st.checkbox("Remanente de deducciones recuperable", value=True, key=key("rem"), disabled=not tope)

with st.sidebar.expander("Financiamiento bancario"):
    credito = st.number_input("Monto del crédito (MXN)", 0.0, 1e9, 0.0, 10e6, key=key("cr"))
    tasa = st.slider("Tasa anual", 0.0, 0.25, float(P["credito_tasa"]), 0.005, key=key("tasa"), format="%.3f")
    plazo = st.slider("Plazo (meses)", 12, 240, int(P["credito_plazo_meses"]), 6, key=key("plazo"))
    gracia = st.slider("Gracia (meses)", 0, 36, int(P["credito_gracia_meses"]), 1, key=key("gracia"))
    mes_disp = st.slider("Mes de disposición", 1, 24, int(P["credito_mes_disposicion"]), 1, key=key("mdisp"))
    com_ap = st.slider("Comisión de apertura", 0.0, 0.03, float(P["credito_comision_apertura"]), 0.0025, key=key("cap_"), format="%.4f")

with st.sidebar.expander("Estructura de inversión y perfil de riesgo", expanded=True):
    perfil = st.selectbox("Perfil del inversionista", list(m.PERFILES) + ["Personalizado"], index=list(m.PERFILES).index("Patrimonial"), key="perfil",
                          help="Cada perfil fija la forma de aportación, la política de distribución y las salvaguardas; en Personalizado se ajustan libremente.")
    PF = m.PERFILES.get(perfil, m.PERFILES["Patrimonial"])
    if perfil != "Personalizado":
        st.caption(PF["descripcion"])
    kp = lambda n: f"{perfil}_{n}"
    pol_ops = list(m.POLITICAS)
    prest_pct = st.slider("Aportación como préstamo intercompañías", 0.0, 1.0, float(PF.get("prestamo_ic_pct", 0.0)), 0.05, key=kp("ppct"),
                          help="Fracción de la aportación que entra a la Operadora como préstamo de Akredita Me (se amortiza sin efecto del art. 78).")
    prest_tasa = st.slider("Tasa del préstamo intercompañías", 0.0, 0.20, float(PF.get("prestamo_ic_tasa", 0.10)), 0.005, key=kp("ptasa"),
                           format="%.3f", disabled=prest_pct == 0)
    prest_plazo = st.slider("Plazo de amortización del préstamo (meses desde inicio de operación)", 12, 240, int(PF.get("prestamo_ic_plazo_meses", 36)), 6,
                            key=kp("pplazo"), disabled=prest_pct == 0)
    politica = st.selectbox("Política de distribución", pol_ops, index=pol_ops.index(PF["politica"]), key=kp("pol"), format_func=m.POLITICAS.get)
    pct_cap = st.slider("% de la caja a disminución de capital", 0.0, 1.0, float(PF.get("pct_capital", 0.5)), 0.05, key=kp("pcap"),
                        disabled=politica not in ("mixta", "tope_fiscal"))
    st.markdown("**Salvaguardas**")
    reserva = st.checkbox("Reserva legal (5% de la utilidad hasta 20% del capital)", value=bool(PF.get("reserva_legal", True)), key=kp("rl"))
    caja_min = st.slider("Caja mínima retenida en la Operadora (meses de egresos)", 0.0, 6.0, float(PF.get("caja_minima_meses", 1.0)), 0.5, key=kp("cm"))
    art78 = st.checkbox("Aplicar art. 78 LISR y CUFIN (ISR por distribución)", value=True, key=kp("a78"))
    with st.popover("Estructura accionaria (para art. 78)"):
        cap_ord = st.number_input("Capital ordinario de la Operadora (MXN)", 1000.0, 1e9, 50000.0, 10000.0, key=kp("co"))
        cap_A = st.number_input("Capital de los socios fundadores en Akredita Me (MXN)", 1000.0, 1e9, 50000.0, 10000.0, key=kp("ca"))
        acc_A = st.number_input("Acciones de los socios fundadores en Akredita Me", 1000.0, 1e10, 50000.0, 10000.0, key=kp("aa"))
    part = st.slider("Participación de Akredita Me en dividendos", 0.50, 1.00, 0.90, 0.01, key=kp("part"),
                     help="Akredita Me traslada íntegros sus dividendos a los inversionistas. El resto corresponde a los socios fundadores (promote, sin aportación de capital).")
    retencion = st.slider("Retención ISR dividendos (personas físicas)", 0.0, 0.30, 0.10, 0.01, key=kp("ret"),
                          help="ISR adicional de 10%. Además, la persona física acumula el dividendo en su declaración anual, con acreditamiento del ISR corporativo.")
    st.caption("Disminución de capital en la Operadora y en Akredita Me: mecanismo por definir.")

with st.sidebar.expander("Descuento"):
    tdesc = st.slider("Tasa de descuento", 0.05, 0.30, float(P["tasa_desc"]), 0.005, key=key("td"), format="%.3f")

params = dict(ritmo=ritmo, precio_kva_2027=precio_kva, capacidad_total=capacidad, factor_energia=factor, precio_mt_2027=precio_mt,
              costo_cfe_2027=costo_cfe, activacion_inicial=act_ini, activacion_mensual=act_mes, sobrecosto=sobrecosto, mes_cod=mes_cod,
              iva_recuperable=iva_rec, meses_devolucion_iva=meses_iva, inflacion=inflacion, mant_mes_2027=mant, submed_mes_2027=subm,
              seguro_pct=seguro, fee_admin=fee_admin, comision_exito=com_exito, isr=isr, ptu=ptu, gasto_corp=gcorp,
              tope_deducciones=tope, excepcion_5_ejercicios=exc5, remanente_recuperable=remrec, credito_monto=credito, credito_tasa=tasa,
              credito_plazo_meses=plazo, credito_gracia_meses=gracia, credito_mes_disposicion=mes_disp, credito_comision_apertura=com_ap,
              tasa_desc=tdesc, prestamo_ic_pct=prest_pct, prestamo_ic_tasa=prest_tasa, prestamo_ic_plazo_meses=prest_plazo)
inv_params = dict(part=part, politica=politica, pct_capital=pct_cap, retencion=retencion, reserva_legal=reserva, caja_minima_meses=caja_min,
                  art78=art78, capital_ordinario_op=cap_ord, acciones_ordinarias_op=cap_ord, capital_fundadores_akredita=cap_A, acciones_fundadores_akredita=acc_A)
r, inv = calcular(tuple(sorted(params.items())), tuple(sorted(inv_params.items())))
# Referencia: escenario Base del modelo con la misma estructura de inversión seleccionada
rb, invb = calcular(tuple(sorted(dict(ritmo=1.0, prestamo_ic_pct=prest_pct, prestamo_ic_tasa=prest_tasa, prestamo_ic_plazo_meses=prest_plazo).items())),
                    tuple(sorted(inv_params.items())))
K, KB = r["kpi"], rb["kpi"]

# ------------------------------------------------------------------ encabezado e indicadores
st.title("Simulador paramétrico — Operadora Energética I")
st.caption("Subestación de 100 MVA · cifras en MXN · comparación contra el escenario Base del modelo · "
           "paybacks medidos desde ene-27, inicio del ejercicio del CAPEX (primer llamado de capital)")
if not _CLAVE and os.environ.get("OP1_AUTH_EXTERNA") != "1":
    st.warning("Acceso sin contraseña. Antes de publicar, defina APP_PASSWORD en los secretos del servidor (ver README).")

def _delta(x, escala=1.0, fmt="{:+.2f}", sufijo=""):
    """Delta contra el Base; None si no hay diferencia visible."""
    if x is None:
        return None
    v = x * escala
    return None if abs(v) < 0.005 else fmt.format(v) + sufijo


st.markdown("**Proyecto**")
c = st.columns(4)
c[0].metric("TIR del proyecto", pct(K["tir"]), _delta(None if K["tir"] is None else K["tir"] - KB["tir"], 100, "{:+.2f}", " pts"))
c[1].metric(f"VPN al {tdesc*100:.1f}% ($ M)", mm(K["vpn"]), _delta(K["vpn"] - KB["vpn"], 1e-6, "{:+,.2f} $ M"))
c[2].metric("Payback", "n/d" if K["payback"] is None else f"{K['payback']:,.2f} años",
            _delta(None if K["payback"] is None or KB["payback"] is None else K["payback"] - KB["payback"], 1.0, "{:+.2f}"), delta_color="inverse",
            help="Medido desde ene-27, inicio del ejercicio del CAPEX (primer llamado de capital).")
c[3].metric("ROI promedio anual", pct(K["roi_promedio"]), _delta(K["roi_promedio"] - KB["roi_promedio"], 100, "{:+.2f}", " pts"))
c = st.columns(4)
c[0].metric("Capital requerido ($ M)", mm(r["capital"]["total"]), _delta(r["capital"]["total"] - rb["capital"]["total"], 1e-6, "{:+,.2f} $ M"),
            delta_color="inverse", help="CAPEX + IVA de la inversión + comisiones de estructuración con su IVA.")
c[1].metric("Ingresos por derechos de uso ($ M)", mm(K["ing_kva_total"]))
c[2].metric("Costo por kVA instalado", f"$ {K['costo_unitario_kva']:,.2f}")
c[3].metric("Utilidad / flujo por kWh", f"$ {K['utilidad_por_kwh']:,.2f} / $ {K['flujo_por_kwh']:,.2f}" if K["utilidad_por_kwh"] else "n/d")
st.markdown("**Inversionistas**")
c = st.columns(4)
c[0].metric("TIR inversionistas (neta)", pct(inv["tir_neta"]), _delta(None if inv["tir_neta"] is None or invb["tir_neta"] is None else inv["tir_neta"] - invb["tir_neta"], 100, "{:+.2f}", " pts"),
            help="Después de la retención de ISR sobre dividendos a personas físicas.")
c[1].metric("Múltiplo sobre capital", f"{inv['mom']:.2f}x")
c[2].metric("Payback con intereses (proyecto)", "n/d" if K["payback_con_intereses"] is None else f"{K['payback_con_intereses']:,.2f} años")
c[3].metric("Devolución total proyectada", m.mes_label(inv["mes_liquidacion"]) if inv["mes_liquidacion"] else "no se completa",
            help="Proyección según la política seleccionada; no constituye una fecha comprometida.")
if credito > 0:
    st.info(f"Crédito: cobertura mínima del servicio de deuda {K['cobertura_servicio_deuda']:.2f}x · horizonte {K['horizonte_deuda_meses']} meses · "
            f"TIR del proyecto sin deuda {pct(K['tir_sin_deuda'])}")

anios = [f"Año {k}" for k in range(21)]
tabs = st.tabs(["Flujo de efectivo", "Estado de resultados", "Inversionistas", "Perfiles de riesgo", "Cuentas fiscales", "Sensibilidad",
                "Detalle mensual", "Supuestos", "Indicadores", "Exportar"])

# ------------------------------------------------------------------ flujo
with tabs[0]:
    df = pd.DataFrame({"Año": list(range(21)), "Escenario simulado": r["anual"]["fcf"] / 1e6, "Base del modelo": rb["anual"]["fcf"] / 1e6})
    dl = df.melt("Año", var_name="Serie", value_name="Monto")
    ch = alt.Chart(dl).mark_bar().encode(
        x=alt.X("Año:O", title="Año"),
        y=alt.Y("Monto:Q", title="Flujo neto ($ M)", axis=alt.Axis(format="$,.2f")),
        xOffset="Serie:N",
        color=alt.Color("Serie:N", scale=alt.Scale(domain=["Escenario simulado", "Base del modelo"], range=[NAVY, GREY])),
        tooltip=[
            alt.Tooltip("Año:O", title="Año"),
            alt.Tooltip("Serie:N", title="Serie"),
            alt.Tooltip("Monto:Q", title="Flujo neto ($ M)", format="$,.2f")
        ]
    ).properties(height=320, title="Flujo neto de efectivo anual ($ M)")
    st.altair_chart(ch, width="stretch")
    dc = pd.DataFrame({"Mes": np.arange(1, 97), "Escenario simulado": np.cumsum(r["fcf"])[:96] / 1e6, "Base del modelo": np.cumsum(rb["fcf"])[:96] / 1e6}).melt("Mes", var_name="Serie", value_name="Monto")
    st.altair_chart(alt.Chart(dc).mark_line().encode(
        x=alt.X("Mes:Q", title="Mes"),
        y=alt.Y("Monto:Q", title="Flujo neto acumulado ($ M)", axis=alt.Axis(format="$,.2f")),
        color=alt.Color("Serie:N", scale=alt.Scale(domain=["Escenario simulado", "Base del modelo"], range=[NAVY, GREY])),
        tooltip=[
            alt.Tooltip("Mes:Q", title="Mes"),
            alt.Tooltip("Serie:N", title="Serie"),
            alt.Tooltip("Monto:Q", title="Flujo neto acumulado ($ M)", format="$,.2f")
        ]
    ).properties(height=260, title="Flujo neto acumulado, primeros 8 años ($ M)"), width="stretch")

# ------------------------------------------------------------------ estado de resultados
with tabs[1]:
    filas = m.estado_resultados_anual(r)
    er = pd.DataFrame({n: a for n, a in filas}).T
    er.columns = anios
    er_fmt = er.copy().astype(object)
    for col in er.columns:
        for idx in er.index:
            val = er.loc[idx, col]
            if pd.isna(val):
                er_fmt.loc[idx, col] = "n/d"
            elif idx == "ROI":
                er_fmt.loc[idx, col] = f"{val * 100:,.2f}%"
            elif idx in ("Derecho de uso (kVA colocados)", "Capacidad activa al cierre (kVA)"):
                er_fmt.loc[idx, col] = f"{val:,.2f} kVA"
            elif idx == "Generación de energía (kWh)":
                er_fmt.loc[idx, col] = f"{val / 1e6:,.2f} GWh"
            else:
                er_fmt.loc[idx, col] = f"$ {val / 1e6:,.2f}"
    st.caption("Cifras en $ M salvo: kVA, generación en GWh y ROI en %. Año 0: periodo preoperativo (ene-27 a nov-28). "
               "Los derechos de uso se presentan al cobro (base fiscal, art. 17 LISR); contablemente se reconocen al quedar disponible la "
               "capacidad y, mientras tanto, se registran como anticipo de clientes. Las comisiones de Akredita Me remuneran a la administración "
               "y no forman parte del retorno de los inversionistas.")
    st.dataframe(er_fmt, width="stretch", height=600)

# ------------------------------------------------------------------ inversionistas
with tabs[2]:
    ia = inv["anual"]
    di = pd.DataFrame({"Año": list(range(21)), "Disminución de capital": ia["red"] / 1e6, "Amortización préstamo": ia["prestamo_pago"] / 1e6,
                       "Intereses netos préstamo": ia["intereses_netos"] / 1e6, "Dividendos a inversionistas": ia["div_inv"] / 1e6,
                       "Dividendos socios fundadores (promote)": ia["div_soc"] / 1e6}).melt("Año", var_name="Concepto", value_name="Monto")
    st.altair_chart(alt.Chart(di).mark_bar().encode(
        x=alt.X("Año:O", title="Año"),
        y=alt.Y("Monto:Q", title="Retorno ($ M)", axis=alt.Axis(format="$,.2f")),
        color=alt.Color("Concepto:N", scale=alt.Scale(
            domain=["Disminución de capital", "Amortización préstamo", "Intereses netos préstamo", "Dividendos a inversionistas", "Dividendos socios fundadores (promote)"],
            range=[GOLD, "#D9B86A", "#5B6778", NAVY, GREY]), legend=alt.Legend(orient="bottom", columns=3, labelLimit=320)),
        tooltip=[
            alt.Tooltip("Año:O", title="Año"),
            alt.Tooltip("Concepto:N", title="Concepto"),
            alt.Tooltip("Monto:Q", title="Monto ($ M)", format="$,.2f")
        ]
    ).properties(height=320, title="Retorno anual a accionistas ($ M)"), width="stretch")
    t = pd.DataFrame({"Aportación (capital + préstamo)": ia["calls"], "Disminución de capital": ia["red"], "Amortización préstamo intercompañías": ia["prestamo_pago"],
                      "Intereses netos del préstamo": ia["intereses_netos"], "Dividendos a Akredita Me (inversionistas)": ia["div_inv"],
                      "Dividendos socios fundadores (promote)": ia["div_soc"], "Retenciones ISR": ia["retencion"]}, index=anios).T / 1e6
    t["Total"] = t.sum(axis=1)
    st.caption("Cifras en $ M.")
    t_fmt = t.map(lambda v: f"$ {v:,.2f}" if pd.notna(v) else "n/d")
    st.dataframe(t_fmt, width="stretch")
    cc = st.columns(4)
    cc[0].metric("TIR antes de retención", pct(inv["tir"], 2))
    cc[1].metric("TIR después de retención", pct(inv["tir_neta"], 2))
    cc[2].metric("Payback inversionistas", "n/d" if inv["payback"] is None else f"{inv['payback']:,.2f} años", help="Desde ene-27.")
    cc[3].metric("Capital no devuelto ($ M)", mm(inv["capital_pendiente"]))

# ------------------------------------------------------------------ sensibilidad
# ------------------------------------------------------------------ perfiles de riesgo
@st.cache_data(show_spinner=False)
def perfiles_cache(params_t, comun_t):
    res = m.comparar_perfiles(dict(params_t), **dict(comun_t))
    return {k: (inv, s) for k, (_, inv, s) in res.items()}

with tabs[3]:
    st.write("Los mismos supuestos del escenario, corridos con cada perfil de inversionista.")
    pm = {k: v for k, v in params.items() if k not in m.CLAVES_MODELO}
    comun = dict(part=part, retencion=retencion, art78=art78, capital_ordinario_op=cap_ord, acciones_ordinarias_op=cap_ord,
                 capital_fundadores_akredita=cap_A, acciones_fundadores_akredita=acc_A)
    resp = perfiles_cache(tuple(sorted(pm.items())), tuple(sorted(comun.items())))
    filas = {
        "TIR antes de retención": lambda s, i: pct(s["tir"], 2), "TIR después de retención": lambda s, i: pct(s["tir_neta"], 2),
        "Payback": lambda s, i: "n/d" if s["payback"] is None else f"{s['payback']:,.2f} años", "Múltiplo": lambda s, i: f"{s['mom']:.2f}x",
        "Aportación devuelta al año 5": lambda s, i: pct(s["capital_devuelto_a5"], 2), "Devolución total proyectada": lambda s, i: s["liquidacion"],
        "Dividendos inversionistas, años 1-5 ($ M)": lambda s, i: mm(s["dividendos_inv_a1_5"], 2),
        "Dividendos socios fundadores (promote), años 1-5 ($ M)": lambda s, i: mm(s["dividendos_socios_a1_5"], 2),
        "Utilidad distribuida art. 78 ($ M)": lambda s, i: mm(i["ud_art78"], 2),
        "ISR art. 10 pagado ($ M)": lambda s, i: mm(s["isr_art10"], 2), "ISR art. 10 no acreditado ($ M)": lambda s, i: mm(s["isr_art10_neto"], 2),
        "Retenciones ISR a inversionistas ($ M)": lambda s, i: mm(s["retenciones"], 2),
        "CUCA al año 5 ($ M)": lambda s, i: mm(s["cuca_a5"], 2),
    }
    tabla = pd.DataFrame({p_: [f(s_, inv_) for f in filas.values()] for p_, (inv_, s_) in resp.items()}, index=list(filas))
    st.dataframe(tabla, width="stretch", height=520)
    for p_, cfg in m.PERFILES.items():
        st.caption(f"**{p_}:** {cfg['descripcion']}")
    acum = pd.DataFrame({p_: np.cumsum(inv_["flujo_neto"])[:144] / 1e6 for p_, (inv_, s_) in resp.items()})
    acum["Mes"] = np.arange(1, 145)
    st.altair_chart(alt.Chart(acum.melt("Mes", var_name="Perfil", value_name="Monto")).mark_line().encode(
        x=alt.X("Mes:Q", title="Mes"),
        y=alt.Y("Monto:Q", title="Flujo neto ($ M)", axis=alt.Axis(format="$,.2f")),
        color="Perfil:N",
        tooltip=[
            alt.Tooltip("Mes:Q", title="Mes"),
            alt.Tooltip("Perfil:N", title="Perfil"),
            alt.Tooltip("Monto:Q", title="Flujo neto ($ M)", format="$,.2f")
        ]
    ).properties(height=300, title="Flujo neto acumulado del inversionista, después de retenciones (primeros 12 años, $ M)"), width="stretch")

# ------------------------------------------------------------------ cuentas fiscales
with tabs[4]:
    ia = inv["anual"]
    cf = pd.DataFrame({"CUCA Operadora (cierre)": ia["cuca_cierre"], "CUFIN Operadora (cierre)": ia["cufin_cierre"], "Reserva legal (cierre)": ia["reserva_cierre"],
                       "Caja Operadora (cierre)": ia["caja_cierre"], "Utilidad distribuida art. 78": ia["ud78"], "ISR art. 10 pagado": ia["isr_art10"],
                       "ISR art. 10 acreditado": ia["credito_art10"], "CUCA Akredita Me (cierre)": ia["cuca_ak_cierre"], "CUFIN Akredita Me (cierre)": ia["cufin_ak_cierre"]},
                      index=anios).T / 1e6
    st.caption("Cifras en $ M. Aproximación para proyección: CUCA actualizada por inflación, CUFIN por ejercicio, art. 78 por acción y ISR art. 10 acreditable "
               "en los dos ejercicios siguientes. Sujeta a validación fiscal.")
    cf_fmt = cf.map(lambda v: f"$ {v:,.2f}" if pd.notna(v) else "n/d")
    st.dataframe(cf_fmt, width="stretch")
    c1, c2, c3 = st.columns(3)
    c1.metric("Utilidad distribuida art. 78 ($ M)", mm(inv["ud_art78"]))
    c2.metric("ISR art. 10 no acreditado ($ M)", mm(inv["isr_art10_neto"] + inv["isr_art10_ak"]))
    c3.metric("Caja mínima en operación ($ M)", mm(inv["caja_min_operacion"]))

with tabs[5]:
    st.write("TIR del proyecto con los parámetros actuales, variando dos supuestos.")
    opciones = {"Precio por kVA ($)": ("precio_kva_2027", precio_kva, 0.10), "Precio MT ($/kWh)": ("precio_mt_2027", precio_mt, 0.05),
                "Factor de energía": ("factor_energia", factor, 0.15), "Ritmo de colocación": ("ritmo", ritmo, 0.4),
                "Sobrecosto de CAPEX": ("sobrecosto", sobrecosto, None), "Comisión de administración": ("fee_admin", fee_admin, None)}
    a1, a2 = st.columns(2)
    v1 = a1.selectbox("Variable en filas", list(opciones), index=1)
    v2 = a2.selectbox("Variable en columnas", list(opciones), index=0)
    if st.button("Calcular tabla de sensibilidad (25 corridas)"):
        def rango(nombre):
            k, v, d = opciones[nombre]
            if k == "sobrecosto":
                return k, [v - 0.10, v - 0.05, v, v + 0.05, v + 0.10]
            if k == "fee_admin":
                return k, [max(0, v - 0.02), max(0, v - 0.01), v, v + 0.01, v + 0.02]
            return k, [v * (1 + d * s) for s in (-1, -0.5, 0, 0.5, 1)]
        k1, r1 = rango(v1); k2, r2 = rango(v2)
        tabla = pd.DataFrame(index=[f"{x:,.2f}" for x in r1], columns=[f"{x:,.2f}" for x in r2])
        prog = st.progress(0.0)
        for i, x in enumerate(r1):
            for j, y in enumerate(r2):
                pp = dict(params); pp[k1] = x; pp[k2] = y
                tir = m.run(**pp)["kpi"]["tir"]
                tabla.iloc[i, j] = "n/d" if tir is None else f"{tir * 100:,.2f}%"
                prog.progress((i * 5 + j + 1) / 25)
        st.dataframe(tabla, width="stretch")
        st.caption(f"Filas: {v1}. Columnas: {v2}. Valores: TIR del proyecto en %.")

# ------------------------------------------------------------------ detalle mensual
SERIES_INV = [("calls", "Aportación de capital (llamados)", "MXN"), ("red", "Disminución de capital", "MXN"),
              ("div_inv", "Dividendos a Akredita Me (inversionistas)", "MXN"), ("div_soc", "Dividendos a socios fundadores (promote)", "MXN"),
              ("caja", "Caja de la Operadora", "MXN"), ("flujo_neto", "Flujo neto del inversionista, después de retenciones", "MXN")]
SERIES_FISC = [("cuca", "CUCA Operadora", "MXN"), ("cufin", "CUFIN Operadora", "MXN"), ("reserva", "Reserva legal", "MXN"),
               ("ud1", "Utilidad distribuida art. 78 (UD1)", "MXN"), ("ud2", "Utilidad distribuida art. 78 (UD2)", "MXN"),
               ("isr_art10", "ISR art. 10 pagado", "MXN"), ("cuca_ak", "CUCA Akredita Me", "MXN"), ("cufin_ak", "CUFIN Akredita Me", "MXN")]

with tabs[6]:
    st.caption("Proyección mensual del modelo financiero, mes por mes (ene-27 a dic-48).")
    grupo = st.radio("Bloque", ["Proyecto", "Inversionistas", "Cuentas fiscales"], horizontal=True, key="det_grupo")
    escala = st.radio("Unidades", ["$ M", "$"], horizontal=True, key="det_escala")
    div_ = 1e6 if escala == "$ M" else 1.0
    if grupo == "Proyecto":
        filas_ = [(c, n, u, r[c]) for c, n, u, _ in m.SERIES_MENSUALES]
    elif grupo == "Inversionistas":
        filas_ = [(c, n, u, inv[c]) for c, n, u in SERIES_INV]
    else:
        filas_ = [(c, n, u, inv["series"][c]) for c, n, u in SERIES_FISC]
    fechas = [m.mes_label(i) for i in range(1, m.N + 1)]

    def _formatear_val(val, u):
        if pd.isna(val):
            return "n/d"
        if u == "MXN":
            return f"$ {val / div_:,.2f}"
        if u == "%":
            return f"{val * 100:,.2f}%"
        if u in ("kVA", "kWh"):
            return f"{val:,.2f} {u}"
        return f"{val:,.2f}"

    def _formatear_tot(v, u):
        if u in ("MXN", "kVA", "kWh"):
            tot = np.sum(v)
            if u == "MXN":
                return f"$ {tot / div_:,.2f}"
            return f"{tot:,.2f} {u}"
        return ""

    det = pd.DataFrame({n: [_formatear_val(val, u) for val in v] for _, n, u, v in filas_}, index=fechas).T
    det.insert(0, "Unidad", [escala if u == "MXN" else u for _, _, u, _ in filas_])
    det.insert(1, "Total", [_formatear_tot(v, u) for _, _, u, v in filas_])
    st.dataframe(det, width="stretch", height=640)
    st.download_button("Descargar este bloque en CSV", det.to_csv().encode("utf-8-sig"), file_name=f"detalle_mensual_{grupo.split()[0].lower()}.csv", mime="text/csv")

# ------------------------------------------------------------------ supuestos
def _fmt(v, u=""):
    if u.startswith("%") and isinstance(v, (float, int, np.floating)) and not isinstance(v, bool):
        return f"{v*100:,.2f}%"
    if isinstance(v, (bool, np.bool_)):
        return "Sí" if v else "No"
    if u in ("MXN", "MXN/mes", "MXN/kWh", "MXN/kVA") and isinstance(v, (float, int, np.floating)):
        return f"$ {v:,.2f}"
    if isinstance(v, (int, np.integer)):
        return f"{v:,}"
    if isinstance(v, (float, np.floating)):
        return f"{v:,.2f}"
    return str(v)

with tabs[7]:
    st.caption("Todos los parámetros del modelo financiero, con el valor simulado y el del escenario Base. "
               "Los parámetros sin control en la barra lateral conservan el valor del Base.")
    sup = pd.DataFrame([{"Parámetro": k, "Descripción": d, "Unidad": u, "Simulado": _fmt(r["p"][k], u), "Base": _fmt(rb["p"][k], u),
                         "Cambia": "●" if _fmt(r["p"][k], u) != _fmt(rb["p"][k], u) else ""}
                        for k, (d, u, _) in m.PARAMETROS_INFO.items()])
    st.dataframe(sup, width="stretch", height=640, hide_index=True)
    cap = r["capital"]
    st.markdown("**Capital requerido (usos)**")
    cap_df = pd.DataFrame({"Monto ($ M)": [cap["capex"], cap["iva"], cap["comisiones"], cap["iva_comisiones"], cap["total"]]},
                          index=["Inversión (CAPEX)", "IVA de la inversión", "Comisiones de estructuración", "IVA de las comisiones", "Capital requerido"]).div(1e6)
    st.dataframe(cap_df.map(lambda v: f"$ {v:,.2f}"), width="content")
    st.markdown("**CAPEX por partida**")
    capex_df = pd.DataFrame({"Monto ($ M)": {k: np.sum(v) / 1e6 for k, v in r["capex_items"].items()}})
    st.dataframe(capex_df.map(lambda v: f"$ {v:,.2f}"), width="content")

# ------------------------------------------------------------------ indicadores
with tabs[8]:
    st.caption("Indicadores clave del modelo financiero contra el escenario Base.")
    def _ind(v, u):
        if v is None:
            return "n/d"
        if u == "%":
            return f"{v*100:,.2f}%"
        if u == "MXN":
            return f"$ {v/1e6:,.2f} M"
        if u == "MXN/kVA":
            return f"$ {v:,.2f} / kVA"
        if u == "MXN/kWh":
            return f"$ {v:,.2f} / kWh"
        if u == "kVA":
            return f"{v:,.2f} kVA"
        if u == "GWh":
            return f"{v:,.2f} GWh"
        if u == "mes":
            return m.mes_label(int(v))
        if u == "meses":
            return f"{int(v)} meses"
        if isinstance(v, (float, int, np.floating)):
            return f"{v:,.2f}"
        return f"{v}"
    ind = pd.DataFrame([{"Indicador": n, "Unidad": u, "Simulado": _ind(K.get(k), u), "Base": _ind(KB.get(k), u)}
                        for k, (n, u, _) in m.INDICADORES_INFO.items()])
    st.dataframe(ind, width="stretch", height=560, hide_index=True)
    st.markdown("**ROI anual proyectado**")
    roi_df = pd.DataFrame({"Simulado": np.array(K["roi_anual"]) * 100, "Base": np.array(KB["roi_anual"]) * 100},
                          index=anios[:len(K["roi_anual"])]).T
    st.dataframe(roi_df.map(lambda v: f"{v:,.2f}%" if pd.notna(v) else "n/d"), width="stretch")

# ------------------------------------------------------------------ exportar
with tabs[9]:
    buf = io.BytesIO()
    m.exportar_excel(r, buf, inv)
    st.download_button("Descargar reporte financiero (.xlsx)", buf.getvalue(), file_name="Simulacion_OP1.xlsx",
                       mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    st.json({k: (v if not isinstance(v, np.ndarray) else "serie") for k, v in params.items()})

st.divider()
st.caption(AVISO)
