# Explicação dos Erros e Correções em `debug.py`

Este documento descreve os erros identificados no código original de `debug.py` e as correções aplicadas.

## Erros Encontrados e Correções

1. **Erro na linha 5: Faltam aspas na string do input**
   - Original: `item1 = float(input(Preço do item 1? ))`
   - Problema: A string "Preço do item 1? " não está entre aspas duplas no início.
   - Correção: Adicionadas aspas duplas: `item1 = float(input("Preço do item 1? "))`

2. **Erro na linha 17: Conversão incorreta do input para desconto**
   - Original: `desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
   - Problema: O input é tratado como string, mas posteriormente usado em operações numéricas, causando erro de tipo.
   - Correção: Convertido para float: `desconto_cupom = float(input(...))`

3. **Erro na linha 26: F-string malformada**
   - Original: `print(" Item 2:        R$ {total_item2:.2f}")`
   - Problema: A string não começa com `f`, então `{total_item2:.2f}` não é interpolado.
   - Correção: Adicionado `f` no início: `print(f" Item 2:        R$ {total_item2:.2f}")`

4. **Erro na linha 31: Indentação incorreta no bloco if**
   - Original: `if desconto_cupom > 0: ` (sem indentação adequada)
   - Problema: O bloco `if` e o `print` dentro dele não estão indentados, causando erro de sintaxe.
   - Correção: Indentado o `if` e o `print` subsequente com 4 espaços.

5. **Erro na linha 32: Indentação do print dentro do if**
   - Original: `print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")` (sem indentação)
   - Problema: Parte do bloco `if`, mas não indentado.
   - Correção: Indentado com 4 espaços.

6. **Melhoria na linha 35: Formatação redundante**
   - Original: `print(f" TOTAL:         R$ {round(total, 2):.2f}")`
   - Problema: `round(total, 2)` arredonda, mas `.2f` também formata. Redundante e pode causar inconsistências.
   - Correção: Removido `round`, usando apenas `.2f`: `print(f" TOTAL:         R$ {total:.2f}")`

## Código Corrigido

O código foi corrigido para funcionar corretamente, mantendo a lógica original de calcular totais de itens, imposto e desconto opcional.