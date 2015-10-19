from __future__ import print_function, division
import numpy as np
import pandas as pd
import nilmtk

dataset = nilmtk.DataSet('/data/mine/vadeec/merged/ukdale.h5')
dataset.set_window("2014-01-01", "2014-06-01")
elec = dataset.buildings[1].elec
washer = elec['washer dryer']
washer_activations = washer.get_activations()

activation = washer_activations[4]
activation = activation.clip(lower=0, upper=2068)
activation.name = 'watts'
PERIOD = 6
activation.index = np.arange(0, len(activation) * PERIOD, PERIOD)

segment_indicies = np.where(np.abs(activation.diff()) > 1200)[0]
segment_indicies = np.concatenate((segment_indicies, [len(activation)]))

smoothed = pd.Series(0, index=activation.index, name='watts')
prev_i = 0
for i in segment_indicies:
    smoothed.iloc[prev_i:i] = activation.iloc[prev_i:i].mean()
    prev_i = i


def to_int(data):
    return data.round().astype(int)

to_int(activation).to_csv(
    'washer_raw.csv', header=True, index_label="seconds")
to_int(smoothed).to_csv(
    'washer_steady_states.csv', header=True, index_label="seconds")
