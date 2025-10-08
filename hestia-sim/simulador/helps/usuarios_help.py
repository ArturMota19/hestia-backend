from networkx import Graph

from simulador.atividade import Atividade
from simulador.usuario import Usuario


class UsuariosHelp:
    usuarios = []
    lista_atividades = []
    grafo_comodos = None

    def __init__(self, usuarios, lista_atividades:list[Atividade], grafo_comodos: Graph):
        __class__.usuarios = usuarios
        __class__.lista_atividades = lista_atividades
        __class__.grafo_comodos = grafo_comodos

    @staticmethod
    def pega_atividade(nome_atividade:str) -> Atividade | None:
        for a in __class__.lista_atividades:
            if nome_atividade == a.nome:
                return a
        return None

    @staticmethod
    def name_usuarios_in_home() -> list[str]:
        return [usuario.nome for usuario in __class__.usuarios if usuario.comodo_atual != "RUA"]

    @staticmethod
    def name_usuarios_in_comodo(nome_comodo: str) -> list[str]:
        return [usuario.nome for usuario in __class__.usuarios if usuario.comodo_atual == nome_comodo]

    @staticmethod
    def usuarios_in_comodo(nome_comodo: str) -> list[Usuario]:
        return [usuario for usuario in __class__.usuarios if usuario.comodo_atual == nome_comodo]
