def calculate_list_statistics(numbers: list[int]) -> tuple[int, float, int, int]:
    """
    Calcula estatísticas básicas de uma lista de números inteiros.

    Args:
        numbers: Lista de números inteiros.

    Returns:
        Uma tupla contendo: (total, média, máximo, mínimo).
    """
    if not numbers:
        raise ValueError("A lista não pode estar vazia.")

    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)

    return total, average, maximum, minimum


if __name__ == "__main__":
    data = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    total, average, maximum, minimum = calculate_list_statistics(data)

    print("total:", total)
    print("media:", average)
    print("maior:", maximum)
    print("menor:", minimum)