import re
from datetime import datetime

import pandas as pd
from io import StringIO

from simulador.helps.usuarios_help import UsuariosHelp


class GravarDados:
    contador_eventos = 0
    contador_arquivos = 0
    dataFrame = pd.DataFrame(columns=['device', 'devId', 'productKey', 'message', 'sensorType', 'group', 'userAction', 'activityUserAction', 'timeStamp', 'space'])
    @staticmethod
    def envia_dados(device, devId, productKey, status, tipo, nome_usuario, atividade,  hora_ativacao, comodo):
        # print(f"'device': {device}, 'message': {status}, 'sensorType': {tipo}, 'group': {UsuariosHelp.name_usuarios_in_home()}, 'userAction': {nome_usuario}, 'activityUserAction': {atividade}, 'timeStamp': {hora_ativacao}, 'space': {comodo}")

        __class__.dataFrame.loc[__class__.contador_eventos] = [device, devId, productKey, status, tipo, UsuariosHelp.name_usuarios_in_home(), nome_usuario, atividade, hora_ativacao, comodo]
        __class__.contador_eventos = __class__.contador_eventos + 1

    @staticmethod
    def gravar(caminho_pasta: str):
        nome_arquivo = f"dados-{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.csv"
        # nome_arquivo = f"dados-validacao-temp.csv"
        __class__.dataFrame.to_csv(f"{caminho_pasta}/{nome_arquivo}", index=False)
        return nome_arquivo

    @staticmethod
    def debug_duplicidade():
        def remove_message_timestamp(message):
            regex = r"'t': \d+\.\d+, "
            new_message = re.sub(regex, '', str(message))
            return new_message

        df = __class__.dataFrame.copy()
        df['message'] = df['message'].apply(remove_message_timestamp)

        unique_devices = df['device'].unique()

        for device in unique_devices:
            result = (df[df['device'] == device]['message'].shift(1) == df[df['device'] == device]['message']).sum()


        duplicated_dict = {}
        for device in unique_devices:
            result = df[df['device'] == device].reset_index()[(df[df['device'] == device]['message'].shift(1) == df[df['device'] == device]['message']).values].index.tolist()
            if len(result) > 0:
                duplicated_dict[device] = result


        duplicated_df = pd.DataFrame()
        for device in duplicated_dict.keys():
            for index in duplicated_dict[device]:
                duplicated_df = pd.concat([duplicated_df, df[df['device'] == device].iloc[index-1:index+1]])

        if len(duplicated_df) >= 2:
            print("duplicado")





