import pandas as pd
import numpy as np
import os

from menu import menu
from datetime import datetime

def merge_routine():
    initial_path = './dados'
    final_path = initial_path + '/merged_routines/'
    dirs = ['/'.join(['original', i]) for i in os.listdir('/'.join([initial_path, 'original']))]
    datasets = ['/'.join([str.lower(dir), dataset]) for dir in dirs for dataset in
                os.listdir('/'.join([initial_path, dir]))] + ['Back']

    number_of_routines = int(input('Number of routines: '))
    datas = {}
    probas = {}

    total_proba = 100
    for i in range(number_of_routines):

        max_size = max(len(option) for option in datasets)
        title = '*' * (max_size // 2) + f' ROUTINE {i+1} ' + '*' * (max_size // 2)
        code = menu(datasets, title)
        csv_path = datasets[code]

        datas[i] = pd.read_csv('/'.join([initial_path, csv_path]), parse_dates=['timeStamp'])
        if i < number_of_routines - 1:
            proba = int(input(f'Probability for Routine {i + 1} [0-{total_proba}]: '))
            probas[i] = proba/100
            total_proba -= proba
        else:
            print(f'Probability for Routine {i + 1} = {total_proba}')
            probas[i] = total_proba / 100

    output = pd.DataFrame()
    for key in datas:
        datas[key]['date'] = datas[key]['timeStamp'].dt.date
    for date in datas[0]['date'].unique():
        winner = np.random.choice(a=list(datas.keys()), p=list(probas.values()))
        output = pd.concat([output, datas[winner][datas[winner]['date'] == date]], axis=0)
    output.drop('date', axis=1, inplace=True)

    csv_name = str(datetime.now()) + '.csv'

    if not 'merged_routines' in os.listdir(initial_path):
        os.mkdir('/'.join([initial_path, 'merged_routines']))
    output.to_csv(final_path + csv_name, index=0)
    print('Successfull!')