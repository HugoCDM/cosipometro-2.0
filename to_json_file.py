import pandas as pd

df = pd.read_excel('D:\cosipometro 2.0\json\Cosipômetro 2.0 - Tabela de faixas.xlsx',
                   sheet_name='Tabela de Faixas')
df.to_json('./json/cosipometro_tabela_faixa_2_0.json',
           indent=2, index=False, orient='records', force_ascii=False)
