from enum import Enum


class Status(Enum):
    ON = "ON"
    OFF = "OFF"


class HumanMotion(Enum):
    NONE = "NONE"
    SMALL_MOVE = "SMALL_MOVE"
    LARGER_MOVE = "LARGER_MOVE"


class ModeAir(Enum):
    COLL = "COLL"
    HOT = "HOT"
    WET = "WET"
    WIND = "WIND"
    AUTO = "AUTO"

class ModeloDados(Enum):
    SIMPLES = "SIMPLES"
    COMPLETO = "COMPLETO"
