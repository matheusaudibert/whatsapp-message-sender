import pandas as pd

INPUT_CSV = "csv/inscricoes.csv"

OUTPUT_APROVADOS = "csv/celulares_aprovados.csv"
OUTPUT_NEGADOS = "csv/celulares_negados.csv"

df = pd.read_csv(INPUT_CSV)

def gerar_csv_por_status(status, output_file):
    df_filtrado = df[df["approval_status"] == status]

    # seleciona telefone + primeiro nome
    df_resultado = df_filtrado[["first_name", "phone_number"]].copy()

    # limpa o telefone (remove .0, +, espaços, etc)
    df_resultado["phone_number"] = (
        df_resultado["phone_number"]
        .astype(str)
        .str.replace(r"\D", "", regex=True)
    )

    df_resultado.to_csv(output_file, index=False)
    print(f"CSV gerado: {output_file}")

gerar_csv_por_status("approved", OUTPUT_APROVADOS)
gerar_csv_por_status("declined", OUTPUT_NEGADOS)
