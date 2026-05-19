import pygame
import random
from settings import *

class Nave(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Para a nave, usaremos um bloco retangular verde
        self.image = pygame.Surface((50, 40))
        self.image.fill(VERDE)
        self.rect = self.image.get_rect()
        self.rect.centerx = LARGURA // 2
        self.rect.bottom = ALTURA - 20
        self.velocidade_x = 0

    def update(self):
        self.velocidade_x = 0
        teclas = pygame.key.get_pressed()
        
        # Controles de movimento
        if teclas[pygame.K_LEFT]:
            self.velocidade_x = -VELOCIDADE_NAVE
        if teclas[pygame.K_RIGHT]:
            self.velocidade_x = VELOCIDADE_NAVE
        
        self.rect.x += self.velocidade_x
        
        # Limita a nave dentro dos limites da tela
        if self.rect.right > LARGURA:
            self.rect.right = LARGURA
        if self.rect.left < 0:
            self.rect.left = 0

class Asteroide(pygame.sprite.Sprite):
    def __init__(self, vel_min, vel_max):
        super().__init__()
        # Tamanho aleatório para os asteroides
        tamanho = random.randint(30, 60)
        self.image = pygame.Surface((tamanho, tamanho))
        self.image.fill(VERMELHO)
        self.rect = self.image.get_rect()
        
        # Posição inicial no topo da tela, X aleatório
        self.rect.x = random.randrange(0, LARGURA - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        
        # Velocidade de queda
        self.velocidade_y = random.randrange(vel_min, vel_max + 1)

    def update(self):
        self.rect.y += self.velocidade_y

class Tiro(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        # Visual do tiro (um pequeno traço amarelo)
        self.image = pygame.Surface((6, 20))
        self.image.fill(AMARELO)
        self.rect = self.image.get_rect()
        
        # O tiro nasce exatamente onde a nave está (x, y recebidos do construtor)
        self.rect.bottom = y
        self.rect.centerx = x
        self.velocidade_y = VELOCIDADE_TIRO

    def update(self):
        self.rect.y += self.velocidade_y
        
        # Autodestruição quando o tiro passa do limite superior da tela
        if self.rect.bottom < 0:
            self.kill()
