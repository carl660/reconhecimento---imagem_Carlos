# Explicação do código `num_primo.py`

Este arquivo descreve o funcionamento da função `is_prime` que verifica se um número é primo.

```python
def is_prime(n: int) -> bool:
    """Retorna True se n for um número primo, caso contrário False."""
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0:
        return False

    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2

    return True


if __name__ == "__main__":
    numero = 29
    print(f"{numero} é primo? {is_prime(numero)}")
```

## Explicação linha a linha

1. `def is_prime(n: int) -> bool:`
   - Define a função chamada `is_prime` que recebe um inteiro `n` e retorna um valor booleano (`True` ou `False`).

2. `"""Retorna True se n for um número primo, caso contrário False."""`
   - Comentário de documentação (docstring) que explica o propósito da função.

3. `if n <= 1:`
   - Verifica se o número é menor ou igual a 1. Números 0 e 1 não são primos.

4. `return False`
   - Se a condição anterior for verdadeira, retorna `False` imediatamente.

5. `if n <= 3:`
   - Verifica se o número é 2 ou 3. Ambos são primos.

6. `return True`
   - Retorna `True` para números 2 e 3.

7. `if n % 2 == 0:`
   - Verifica se o número é par. Números pares maiores que 2 não são primos.

8. `return False`
   - Retorna `False` se `n` for um número par maior que 2.

9. `i = 3`
   - Inicializa o divisor `i` em 3. A função vai testar divisores ímpares apenas.

10. `while i * i <= n:`
    - Continua a verificação enquanto `i` for menor ou igual à raiz quadrada de `n`. Isso é suficiente para encontrar divisores.

11. `if n % i == 0:`
    - Verifica se `n` é divisível por `i` sem resto.

12. `return False`
    - Se `n` for divisível por `i`, não é primo e a função retorna `False`.

13. `i += 2`
    - Incrementa `i` em 2 para testar apenas números ímpares (3, 5, 7, ...).

14. `return True`
    - Se nenhum divisor for encontrado até a raiz quadrada, `n` é primo e a função retorna `True`.

15. `if __name__ == "__main__":`
    - Verifica se o arquivo está sendo executado diretamente, e não importado como módulo.

16. `numero = 29`
    - Define um valor de teste para verificação.

17. `print(f"{numero} é primo? {is_prime(numero)}")`
    - Chama a função `is_prime` e imprime o resultado no console.
