from abc import ABC

from simulador.devices.actions.DeviceBase import DeviceBase


class SensorBase(DeviceBase, ABC):
    def __init__(self, env, nome_comodo, tipo, tipo_selecionado: str, tipoEnv):
        super().__init__(env, nome_comodo, tipo, tipo_selecionado, tipoEnv)
