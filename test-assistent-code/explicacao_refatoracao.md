# Explicação do código `refatoracao.py`

Este arquivo descreve o funcionamento da função `c` que calcula estatísticas básicas de uma lista de números: total, média, maior e menor valor.

```python
def c(l):
    t=0
    for i in range(len(l)):
        t=t+l[i]
    m=t/len(l)
    mx=l[0]
    mn=l[0]
    for i in range(len(l)):
        if l[i]>mx:
            mx=l[i]
        if l[i]<mn:
            mn=l[i]
    return t,m,mx,mn

x=[23,7,45,2,67,12,89,34,56,11]
a,b,c2,d=c(x)
print("total:",a)
print("media:",b)
print("maior:",c2)
print("menor:",d)
```

## Explicação linha a linha

1. `def c(l):`
   - Define a função chamada `c` que recebe uma lista `l` como parâmetro.

2. `t=0`
   - Inicializa a variável `t` (total) com 0 para acumular a soma dos elementos da lista.

3. `for i in range(len(l)):`
   - Inicia um loop que itera sobre os índices da lista `l`, de 0 até o comprimento da lista menos 1.

4. `t=t+l[i]`
   - Adiciona o valor do elemento na posição `i` da lista à variável `t`.

5. `m=t/len(l)`
   - Calcula a média `m` dividindo o total `t` pelo número de elementos na lista.

6. `mx=l[0]`
   - Inicializa `mx` (máximo) com o primeiro elemento da lista.

7. `mn=l[0]`
   - Inicializa `mn` (mínimo) com o primeiro elemento da lista.

8. `for i in range(len(l)):`
   - Inicia outro loop para percorrer todos os elementos da lista novamente.

9. `if l[i]>mx:`
   - Verifica se o elemento atual `l[i]` é maior que o valor atual de `mx`.

10. `mx=l[i]`
    - Se for maior, atualiza `mx` com o novo valor máximo.

11. `if l[i]<mn:`
    - Verifica se o elemento atual `l[i]` é menor que o valor atual de `mn`.

12. `mn=l[i]`
    - Se for menor, atualiza `mn` com o novo valor mínimo.

13. `return t,m,mx,mn`
    - Retorna uma tupla com os valores calculados: total, média, máximo e mínimo.

14. (linha vazia)

15. `x=[23,7,45,2,67,12,89,34,56,11]`
    - Define uma lista `x` com 10 números inteiros para teste.

16. `a,b,c2,d=c(x)`
    - Chama a função `c` com a lista `x` e desempacota os valores retornados nas variáveis `a`, `b`, `c2` e `d`.

17. `print("total:",a)`
    - Imprime o total calculado.

18. `print("media:",b)`
    - Imprime a média calculada.

19. `print("maior:",c2)`
    - Imprime o maior valor encontrado.

20. `print("menor:",d)`
    - Imprime o menor valor encontrado.