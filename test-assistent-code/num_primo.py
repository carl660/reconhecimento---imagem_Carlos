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