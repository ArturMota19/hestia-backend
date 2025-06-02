## Regras para a Criação do Arquivo JSON do Simulador de Ambientes Inteligentes

## 1. Estrutura Geral
O arquivo de configuração deve ser um **objeto JSON** contendo as seguintes **seções**:
- **ATUADORES**
- **COMODOS**
- **GRAFO_COMODOS**
- **ATIVIDADES**
- **USUARIOS**
- **AUTOMACAO** (opcional)

## 2. Listar Atuadores (chave "ATUADORES")
Deve conter todos os dispositivos possíveis no ambiente. Os dispositivos são listados a baixo:
- LAMPADA
- CAFETEIRA
- PLUG
- SOM
- AR_CONDICIONADO
- TV
- SENSOR_PRESENCA

Cada atuador possui atributos específicos
- LAMPADA: switch_led (ON/OFF), bright_value_v2 (0–1000), temp_value_v2 (0–1000)
- CAFETEIRA: switch (ON/OFF)
- PLUG: switch_1 (ON/OFF)
- SOM: switch (ON/OFF), sound_volume (0–100)
- AR_CONDICIONADO: switch (ON/OFF), temp_set (16–30), mode (COLL/HOT/WET/WIND/AUTO)
- TV: switch (ON/OFF), sound_volume (0–100)
- SENSOR_PRESENCA: presence_state (ON/OFF), human_motion_state (NONE/SMALL_MOVE/LARGER_MOVE)

## 3. Definir os Cômodos (chave "COMODOS")
Cada cômodo deve ter:
- "nome" (por exemplo, "SALA", "COZINHA", "BANHEIRO" etc.)
- "atuadores" (lista de dispositivos presentes nesse cômodo)
- "ocupacao_maxima" (limite de pessoas simultâneas)
Exemplo:
```
"sala": {
  "nome": "SALA",
  "atuadores": ["LAMPADA", "TV", "SOM"],
  "ocupacao_maxima": 4
}

```

## 4. Modelar o Grafo de Cômodos (chave "GRAFO_COMODOS")
Define as conexões entre cômodos indicando a distância entre eles através de uma lista de listas que descrevem cada conexão. Todo grafo deve ter um cômodo "RUA" ligado a outro comodo.
Exemplo:
```
"GRAFO_COMODOS": [
  ["RUA", "SALA", 5],
  ["SALA", "COZINHA", 3]
]

```

## 5. Descrever as Atividades (chave "ATIVIDADES")
Cada chave é o nome de uma atividade (ex.: "Assistir_TV"), e o valor é um objeto que contém:
- "nome": Nome identificador da atividade.
- "inicio_ocorrencia" e "fim_ocorrencia" (opcionais): Período de início/fim.
- "duracao": Tempo de duração (em minutos).
- "taxa_erro": Margem de variação da duração (ex.: 0.1 = 10%).
- "local_atividade": Cômodo onde a atividade ocorre.
- "atividades_associadas": Outras atividades que podem ocorrer simultaneamente, com a probabilidade de acontecerem.
- "lista_atuadores_atividade": Dispositivos utilizados e seus estados durante a atividade.

Cada chave dentro de "lista_atuadores_atividade" corresponde a um atuador, e o valor é uma lista com dois elementos:
- O estado do dispositivo (por exemplo, "ON" ou "OFF").
- O comportamento do dispositivo caso haja uma atividade secundária:
    - "D" (Desligar caso atividade secundária ocorra)
    - "P" (Permanecer ligado mesmo com atividade secundária)

Exemplo:
```
"USAR_PC_MANHA": {
			"nome": "USAR_PC_MANHA",
			"inicio_ocorrencia": null,
			"fim_ocorrencia": null,
			"duracao": 60,
			"taxa_erro": 0.09,
			"local_atividade": "QUARTO",
			"atividades_associadas": {
				"USAR_BANHEIRO": 0.07,
				"IR_NA_VARANDA": 0.8,
				"BEBER_AGUA": 0.04,
				"SAIR_COMODO_5M": 0.3
			},
			"lista_atuadores_atividade": {
				"PLUG_01": ["ON", "P"]
			}
		}

```

## 6. Definição dos Usuários (USUARIOS)
Cada usuário no sistema deve ter:
- "nome"
- "prioridade" (relevância das preferencias desse usuário)
- "comodo_atual" (onde o usuário inicia)
- "preferencia" (por cômodo e dispositivo)
    - Exemplos de preferências, com todos os atributos possíveis conforme o atuador:
```
"SALA": {
  "LAMPADA": {
    "switch_led": "ON",
    "bright_value_v2": 700,
    "temp_value_v2": 400
  },
  "TV": {
    "switch": "OFF",
    "sound_volume": 40
  }
}
```
- "rotina_semanal"
    - Lista de 7 sublistas, cada qual representando um dia da semana.
    - Cada sublista deve cobrir 24 horas (1440 minutos) de atividades em sequência.
    - Cada sublista inicia as 00:00 e vai até 23:59
    - A rotina deve conter apenas atividades que foram definidas


## 7. (Opcional) Seção de Automação (`AUTOMACAO`)
Este campo deve permanecer vazio.
Exemplo:
```
"AUTOMACAO": []
```

## 8. Cobertura de 24 horas por dia na Rotina
- A soma das durações das atividades de cada dia deve alcançar 1440 minutos (das 00:00 às 23:59).
- Não deixar intervalos sem atividade.

## 9. Coerência entre Preferências e Atuadores
- Só inclua nas preferências dispositivos existentes no cômodo.
- Se não houver preferências para determinado cômodo, pode omitir ou deixar vazio.

## 10. Validação Final
Certifique-se de que a estrutura JSON é válida e que todos os campos necessários estão corretamente preenchidos e consistentes.


## 11. Exemplo Completo de Arquivo

```
{
  "ATUADORES": [
    "LAMPADA",
    "CAFETEIRA",
    "PLUG",
    "SOM",
    "AR_CONDICIONADO",
    "TV",
    "SENSOR_PRESENCA"
  ],

  "COMODOS": {
    "rua": {
      "nome": "RUA",
      "atuadores": [],
      "ocupacao_maxima": 5
    },
    "sala": {
      "nome": "SALA",
      "atuadores": [
        "LAMPADA",
        "AR_CONDICIONADO",
        "SOM",
        "TV",
        "SENSOR_PRESENCA"
      ],
      "ocupacao_maxima": 4
    },
    "cozinha": {
      "nome": "COZINHA",
      "atuadores": [
        "LAMPADA",
        "SENSOR_PRESENCA",
        "CAFETEIRA",
        "PLUG"
      ],
      "ocupacao_maxima": 2
    },
    "banheiro": {
      "nome": "BANHEIRO",
      "atuadores": [
        "LAMPADA",
        "SENSOR_PRESENCA"
      ],
      "ocupacao_maxima": 1
    },
    "quarto": {
      "nome": "QUARTO",
      "atuadores": [
        "LAMPADA",
        "AR_CONDICIONADO",
        "SENSOR_PRESENCA"
      ],
      "ocupacao_maxima": 2
    }
  },

  "GRAFO_COMODOS": [
    ["RUA", "SALA", 5],
    ["SALA", "COZINHA", 3],
    ["SALA", "QUARTO", 4],
    ["COZINHA", "BANHEIRO", 2],
    ["QUARTO", "BANHEIRO", 3]
  ],

  "ATIVIDADES": {
    "DORMIR": {
      "nome": "DORMIR",
      "duracao": 420,
      "taxa_erro": 0.05,
      "local_atividade": "QUARTO",
      "lista_atuadores_atividade": {
        "LAMPADA": ["OFF", "P"],
        "AR_CONDICIONADO": ["ON", "P"]
      }
    },
    "BANHO": {
      "nome": "BANHO",
      "duracao": 15,
      "taxa_erro": 0.1,
      "local_atividade": "BANHEIRO",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "D"]
      }
    },
    "USAR_BANHEIRO": {
      "nome": "USAR_BANHEIRO",
      "duracao": 10,
      "taxa_erro": 0.1,
      "local_atividade": "BANHEIRO",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "D"]
      }
    },
    "COZINHAR": {
      "nome": "COZINHAR",
      "duracao": 45,
      "taxa_erro": 0.1,
      "local_atividade": "COZINHA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "P"],
        "CAFETEIRA": ["OFF", "D"],
        "PLUG": ["OFF", "D"]
      }
    },
    "ALMOCAR": {
      "nome": "ALMOCAR",
      "duracao": 30,
      "taxa_erro": 0.1,
      "local_atividade": "COZINHA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "D"]
      }
    },
    "TRABALHAR": {
      "nome": "TRABALHAR",
      "duracao": 360,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "P"],
        "AR_CONDICIONADO": ["ON", "P"]
      }
    },
    "EXERCICIOS": {
      "nome": "EXERCICIOS",
      "duracao": 45,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "SOM": ["ON", "D"],
        "LAMPADA": ["ON", "P"]
      }
    },
    "LER": {
      "nome": "LER",
      "duracao": 60,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "D"]
      }
    },
    "LIMPAR_QUARTO": {
      "nome": "LIMPAR_QUARTO",
      "duracao": 30,
      "taxa_erro": 0.1,
      "local_atividade": "QUARTO",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "P"]
      }
    },
    "JANTAR": {
      "nome": "JANTAR",
      "duracao": 45,
      "taxa_erro": 0.1,
      "local_atividade": "COZINHA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "D"]
      }
    },
    "LAZER": {
      "nome": "LAZER",
      "duracao": 120,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "P"]
      }
    },
    "FAZER_COMPRAS": {
      "nome": "FAZER_COMPRAS",
      "duracao": 60,
      "taxa_erro": 0.1,
      "local_atividade": "RUA",
      "lista_atuadores_atividade": {}
    },
    "ARRUMAR_CASA": {
      "nome": "ARRUMAR_CASA",
      "duracao": 60,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "LAMPADA": ["ON", "P"]
      }
    },
    "ASSISTIR_TV": {
      "nome": "ASSISTIR_TV",
      "duracao": 90,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {
        "TV": ["ON", "D"],
        "LAMPADA": ["ON", "D"]
      }
    },
    "PAUSA": {
      "nome": "PAUSA",
      "duracao": 40,
      "taxa_erro": 0.1,
      "local_atividade": "SALA",
      "lista_atuadores_atividade": {}
    }
  },

  "USUARIOS": {
    "maria": {
      "nome": "Maria",
      "prioridade": 1,
      "comodo_atual": "RUA",
      "preferencia": {
        "SALA": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 700,
            "temp_value_v2": 400
          },
          "AR_CONDICIONADO": {
            "switch": "ON",
            "temp_set": 22,
            "mode": "AUTO"
          },
          "SOM": {
            "switch": "ON",
            "sound_volume": 25
          },
          "TV": {
            "switch": "OFF",
            "sound_volume": 40
          }
        },
        "QUARTO": {
          "LAMPADA": {
            "switch_led": "OFF",
            "bright_value_v2": 300,
            "temp_value_v2": 200
          },
          "AR_CONDICIONADO": {
            "switch": "ON",
            "temp_set": 20,
            "mode": "AUTO"
          }
        },
        "COZINHA": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 500,
            "temp_value_v2": 250
          },
          "CAFETEIRA": {
            "switch": "ON"
          },
          "PLUG": {
            "switch_1": "OFF"
          }
        },
        "BANHEIRO": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 200,
            "temp_value_v2": 100
          }
        }
      },
      "rotina_semana": [
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "COZINHAR",
          "ALMOCAR",
          "TRABALHAR",
          "EXERCICIOS",
          "LER",
          "LIMPAR_QUARTO",
          "JANTAR",
          "LAZER",
          "FAZER_COMPRAS",
          "ARRUMAR_CASA",
          "ASSISTIR_TV",
          "PAUSA",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "EXERCICIOS",
          "COZINHAR",
          "ALMOCAR",
          "LER",
          "FAZER_COMPRAS",
          "TRABALHAR",
          "LIMPAR_QUARTO",
          "USAR_BANHEIRO",
          "LAZER",
          "ARRUMAR_CASA",
          "ASSISTIR_TV",
          "PAUSA",
          "JANTAR"
        ],
        [
          "DORMIR",
          "BANHO",
          "COZINHAR",
          "USAR_BANHEIRO",
          "TRABALHAR",
          "ALMOCAR",
          "ARRUMAR_CASA",
          "EXERCICIOS",
          "ASSISTIR_TV",
          "FAZER_COMPRAS",
          "JANTAR",
          "LER",
          "LIMPAR_QUARTO",
          "LAZER",
          "PAUSA",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "LER",
          "ALMOCAR",
          "TRABALHAR",
          "COZINHAR",
          "PAUSA",
          "EXERCICIOS",
          "USAR_BANHEIRO",
          "ASSISTIR_TV",
          "LAZER",
          "LIMPAR_QUARTO",
          "FAZER_COMPRAS",
          "ARRUMAR_CASA",
          "JANTAR",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "FAZER_COMPRAS",
          "TRABALHAR",
          "COZINHAR",
          "ALMOCAR",
          "ARRUMAR_CASA",
          "LAZER",
          "EXERCICIOS",
          "JANTAR",
          "PAUSA",
          "ASSISTIR_TV",
          "LIMPAR_QUARTO",
          "LER",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "EXERCICIOS",
          "ARRUMAR_CASA",
          "TRABALHAR",
          "ALMOCAR",
          "LAZER",
          "COZINHAR",
          "LIMPAR_QUARTO",
          "JANTAR",
          "FAZER_COMPRAS",
          "ASSISTIR_TV",
          "LER",
          "PAUSA",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "LER",
          "USAR_BANHEIRO",
          "TRABALHAR",
          "ALMOCAR",
          "ASSISTIR_TV",
          "EXERCICIOS",
          "FAZER_COMPRAS",
          "COZINHAR",
          "JANTAR",
          "ARRUMAR_CASA",
          "LIMPAR_QUARTO",
          "LAZER",
          "PAUSA",
          "USAR_BANHEIRO"
        ]
      ]
    },
    "joao": {
      "nome": "João",
      "prioridade": 2,
      "comodo_atual": "RUA",
      "preferencia": {
        "SALA": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 600,
            "temp_value_v2": 300
          },
          "AR_CONDICIONADO": {
            "switch": "ON",
            "temp_set": 24,
            "mode": "AUTO"
          },
          "SOM": {
            "switch": "ON",
            "sound_volume": 50
          },
          "TV": {
            "switch": "ON",
            "sound_volume": 60
          }
        },
        "QUARTO": {
          "LAMPADA": {
            "switch_led": "OFF",
            "bright_value_v2": 200,
            "temp_value_v2": 150
          },
          "AR_CONDICIONADO": {
            "switch": "ON",
            "temp_set": 18,
            "mode": "COLL"
          }
        },
        "COZINHA": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 400,
            "temp_value_v2": 200
          },
          "CAFETEIRA": {
            "switch": "OFF"
          },
          "PLUG": {
            "switch_1": "OFF"
          }
        },
        "BANHEIRO": {
          "LAMPADA": {
            "switch_led": "ON",
            "bright_value_v2": 150,
            "temp_value_v2": 100
          }
        }
      },
      "rotina_semana": [
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "EXERCICIOS",
          "TRABALHAR",
          "ALMOCAR",
          "LER",
          "ASSISTIR_TV",
          "FAZER_COMPRAS",
          "COZINHAR",
          "JANTAR",
          "ARRUMAR_CASA",
          "LIMPAR_QUARTO",
          "LAZER",
          "PAUSA",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "COZINHAR",
          "ALMOCAR",
          "LIMPAR_QUARTO",
          "USAR_BANHEIRO",
          "TRABALHAR",
          "LAZER",
          "EXERCICIOS",
          "FAZER_COMPRAS",
          "PAUSA",
          "ASSISTIR_TV",
          "ARRUMAR_CASA",
          "LER",
          "JANTAR",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "LER",
          "EXERCICIOS",
          "ARRUMAR_CASA",
          "TRABALHAR",
          "LAZER",
          "COZINHAR",
          "FAZER_COMPRAS",
          "ALMOCAR",
          "ASSISTIR_TV",
          "LIMPAR_QUARTO",
          "JANTAR",
          "PAUSA",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "COZINHAR",
          "EXERCICIOS",
          "USAR_BANHEIRO",
          "ALMOCAR",
          "ARRUMAR_CASA",
          "TRABALHAR",
          "JANTAR",
          "FAZER_COMPRAS",
          "PAUSA",
          "LAZER",
          "LIMPAR_QUARTO",
          "ASSISTIR_TV",
          "LER",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "FAZER_COMPRAS",
          "LER",
          "TRABALHAR",
          "ALMOCAR",
          "EXERCICIOS",
          "LAZER",
          "COZINHAR",
          "LIMPAR_QUARTO",
          "PAUSA",
          "ARRUMAR_CASA",
          "ASSISTIR_TV",
          "JANTAR",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "ARRUMAR_CASA",
          "ALMOCAR",
          "USAR_BANHEIRO",
          "COZINHAR",
          "TRABALHAR",
          "FAZER_COMPRAS",
          "LAZER",
          "EXERCICIOS",
          "JANTAR",
          "PAUSA",
          "ASSISTIR_TV",
          "LER",
          "LIMPAR_QUARTO",
          "USAR_BANHEIRO"
        ],
        [
          "DORMIR",
          "BANHO",
          "USAR_BANHEIRO",
          "TRABALHAR",
          "COZINHAR",
          "LAZER",
          "FAZER_COMPRAS",
          "EXERCICIOS",
          "LIMPAR_QUARTO",
          "ALMOCAR",
          "ARRUMAR_CASA",
          "ASSISTIR_TV",
          "LER",
          "JANTAR",
          "PAUSA",
          "USAR_BANHEIRO"
        ]
      ]
    }
  },

  "AUTOMACAO": []
}

```
