import pandas as pd
import numpy as np
import sys
import os

from datetime import datetime, time, timedelta

from menu import menu


def transform_data(dataframe: pd.DataFrame, device_column: str, device_state_column: str, group_column: str, time_column: str) -> pd.DataFrame:
    data = dataframe.copy() # Copiando dataframe para evitar modificação no dataframe externo
    data[time_column] = data[time_column].apply(lambda string: datetime.strptime(string, '%Y-%m-%d %H:%M:%S.%f')) # transformando string em datetime
    data.set_index(time_column, inplace=True) # levando o datetime para o índice do dataframe
    start = datetime(data.index[0].year, data.index[0].month, data.index[0].day, 0, 0, 0) # pegando o datetime inicial
    end = datetime(data.index[-1].year, data.index[-1].month, data.index[-1].day, 23, 59, 59) # pegando o datetime final
    # datetimes = pd.date_range(start=start, end=end, freq='s') # criando uma lista com todos datetimes entre start e end com 1 seg de frequência
    activity_datetimes = data.index.unique() # pegando os datetimes únicos do dataframe passado

    columns = data[device_column].unique() # pegando as colunas de devices
    state = dict(zip(columns, ['OFF'] * len(columns))) # iniciando o estado da casa com tudo OFF
    group = pd.Series(data.loc[activity_datetimes[0]][group_column]).values[-1] # iniciando o grupo presente na casa
    historic = [] # criando o histórico

    i = 0
    for count, dt in enumerate(activity_datetimes):
        state['timestamp'] = dt # cada estado do histórico recebe um novo timestamp
        if i != len(activity_datetimes): # o estado só muda se o datetime atual for igual ao datetime das atividades
            updated_devices = pd.Series(data.loc[activity_datetimes[i]][device_column]).values # lista com os devices que mudaram de estado no tempo atual
            updated_message = pd.Series(data.loc[activity_datetimes[i]][device_state_column]).values # lista os estados que mudaram no tempo atual
            update_state = dict(zip(updated_devices, updated_message)) # dicionário com {device: novo_estado}
            group = pd.Series(data.loc[activity_datetimes[i]][group_column]).values[-1] # inserindo o grupo no estado atual
            state = {**state, **update_state} # modificando os estados anteriores pelos atuais
            i += 1 # incrementando o contador de atividades da casa
        state[group_column] = group
        historic.append(state.copy()) # inserindo estado atual no histórico

        # Contabilização do progresso da função
        progress = (count+1)/len(activity_datetimes)
        progress_bar = f'[{"#"*int((progress*30)) + "-"*int((1-progress)*30)}]'
        sys.stdout.write('\r'+f'Progress: {progress_bar} {count+1}/{len(activity_datetimes)} ({round(100*progress, 2)}%)')
    sys.stdout.write('\r')
    output = pd.DataFrame(historic)
    output = output[((output != output.shift()).sum(axis=1) > 1)].reset_index(drop=True)
    return output


def transform():
    initial_path = './dados'
    dirs = ['/'.join(['original', i]) for i in os.listdir('/'.join([initial_path, 'original']))] +\
                  ['multiple_routines', 'merged_routines']

    datasets = ['/'.join([str.lower(dir), dataset]) for dir in dirs if dir.split('/')[0] in os.listdir(initial_path) for dataset in
                os.listdir('/'.join([initial_path, dir]))] + ['Back']
    max_size = max(len(option) for option in datasets)
    title = '*' * (max_size // 2) + ' SELECT A DATASET TO TRANSFORM ' + '*' * (max_size // 2)
    code = menu(datasets, title)
    csv_path = datasets[code]

    if csv_path != 'Back':
        df = pd.read_csv('/'.join([initial_path, csv_path]))
        csv_path = csv_path.split('/')[-1]
        if not 'transformed' in os.listdir(initial_path):
            os.mkdir('/'.join([initial_path, 'transformed']))
        final_path = '/'.join([initial_path, 'transformed', csv_path])
        new_data = transform_data(dataframe=df, device_column='device', device_state_column='message',
                                  group_column='group', time_column='timeStamp')
        new_data.to_csv(final_path, index=0)
        print(f'Transformed data saved in {final_path}')
        return False
    else:
        return True