import os
import sys
from datetime import datetime, timedelta

import pandas as pd

from menu import menu


def routines_join():
    initial_path = './dados'

    dirs = [dir for dir in os.listdir('/'.join([initial_path, 'original']))]
    datasets = ['/'.join([str.lower(dir), dataset]) for dir in dirs for dataset in os.listdir('/'.join([initial_path, 'original', dir]))]
    datasets += ['Back']

    max_size = max(len(option) for option in datasets)
    title = '*' * (max_size // 2) + ' SELECT THE DATASETS ' + '*' * (max_size // 2)

    codes = []
    stop = False
    while not stop:
        code = menu(datasets, title)
        if datasets[code] != 'Back':
            if 'Join' not in datasets:
                datasets += ['Join']
            if 'Back' in datasets:
                datasets.remove('Back')
        else:
            return True

        if datasets[code] == 'Join':
            stop = True
        else:
            codes.append(code)
            print(f"Routine {len(codes)}: {datasets[code]}")
    dir_paths = [datasets[code].split('/')[0] for code in codes]
    csv_paths = [datasets[code].split('/')[1] for code in codes]
    concatenated_df = pd.DataFrame()
    for i, _ in enumerate(csv_paths):
        df = pd.read_csv('/'.join([initial_path, 'original', dir_paths[i], csv_paths[i]]))
        df['timeStamp'] = df['timeStamp'].apply(
            lambda dt: datetime.strptime(dt, '%Y-%m-%d %H:%M:%S.%f'))
        if i > 0:
            time_delta = df['timeStamp'].iloc[0] - concatenated_df['timeStamp'].iloc[-1]
            df['timeStamp'] = (df['timeStamp'] - timedelta(days=time_delta.days))
        concatenated_df = pd.concat([concatenated_df, df])

    if not 'multiple_routines' in os.listdir(initial_path):
        os.mkdir('/'.join([initial_path, 'multiple_routines']))
    initial_path += '/multiple_routines'

    days = concatenated_df['timeStamp'].dt.date.nunique()
    initial_dt = concatenated_df['timeStamp'].min()
    last_dt = concatenated_df['timeStamp'].max()

    concatenated_df.to_csv('/'.join([initial_path, str(datetime.now()) + '.csv']), index=0)

    print(f'\nDays: {days}\n'
          f'Initial_datetime: {initial_dt}\n'
          f'Last_datetime: {last_dt}')
    print(f"Saved in {initial_path} as {str(datetime.now()) + '.csv'}")
    return False