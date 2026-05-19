import pygame
import sys
from settings import *
from sprites import Nave, Asteroide, Tiro

class Jogo:
    def __init__(self):
        # Inicializa o Pygame e cria a janela
        pygame.init()
        self.tela = pygame.display.set_mode((LARGURA, ALTURA))
        pygame.display.set_caption("Jogo Atari 2D - Defesa da Nave")
        self.clock = pygame.time.Clock()
        self.rodando = True
        
    def desenhar_texto(self, texto, tamanho, cor, x, y):
        # Uma função auxiliar para escrever texto na tela
        fonte = pygame.font.SysFont("arial", tamanho, bold=True)
        superficie = fonte.render(texto, True, cor)
        self.tela.blit(superficie, (x, y))

    def novo_jogo(self):
        # Reseta as variáveis e cria os grupos de Sprites
        self.pontuacao = 0
        self.todos_sprites = pygame.sprite.Group()
        self.asteroides = pygame.sprite.Group()
        self.tiros = pygame.sprite.Group()
        
        # Cria a nave
        self.nave = Nave()
        self.todos_sprites.add(self.nave)
        
        # Cria os asteroides iniciais
        for _ in range(6):
            self.criar_asteroide()
            
        self.executar()

    def criar_asteroide(self):
        # Aumenta a velocidade baseando-se na pontuação (a cada 50 pontos aumenta 1 de velocidade)
        incremento = self.pontuacao // 50
        vel_min = VELOCIDADE_ASTEROIDE_MIN_INICIAL + incremento
        vel_max = VELOCIDADE_ASTEROIDE_MAX_INICIAL + incremento
        
        # Limitar a velocidade máxima para não ficar impossível ou quebrar a física do jogo
        vel_min = min(vel_min, 12)
        vel_max = min(vel_max, 18)
        
        # Adiciona um novo asteroide aos grupos
        asteroide = Asteroide(vel_min, vel_max)
        self.todos_sprites.add(asteroide)
        self.asteroides.add(asteroide)

    def executar(self):
        # Loop do jogo enquanto estivermos na partida
        self.jogando = True
        while self.jogando:
            self.clock.tick(FPS)
            self.eventos()
            self.update()
            self.draw()

    def eventos(self):
        # Processa as entradas (cliques e botões)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                if self.jogando:
                    self.jogando = False
                self.rodando = False
                
            elif event.type == pygame.KEYDOWN:
                # O espaço realiza o disparo
                if event.key == pygame.K_SPACE:
                    tiro = Tiro(self.nave.rect.centerx, self.nave.rect.top)
                    self.todos_sprites.add(tiro)
                    self.tiros.add(tiro)

    def update(self):
        # Atualiza a posição de todo mundo
        self.todos_sprites.update()
        
        # Colisão Tiro com Asteroide
        # Se baterem, o asteroide e o tiro são destruídos (True, True)
        acertos = pygame.sprite.groupcollide(self.asteroides, self.tiros, True, True)
        for acerto in acertos:
            self.pontuacao += 10
            # Sempre que um for destruído, criamos outro para manter o fluxo
            self.criar_asteroide()
            
        # Colisão Nave com Asteroide (Game Over)
        colisoes_nave = pygame.sprite.spritecollide(self.nave, self.asteroides, False)
        if colisoes_nave:
            self.jogando = False
            
        # Verifica se algum asteroide passou da tela pelo fundo (Game Over)
        for a in self.asteroides:
            if a.rect.top > ALTURA:
                self.jogando = False

    def draw(self):
        # Pinta a tela de preto e desenha as entidades
        self.tela.fill(PRETO)
        self.todos_sprites.draw(self.tela)
        
        # Exibe a pontuação no canto superior esquerdo
        self.desenhar_texto(f"Pontos: {self.pontuacao}", 28, BRANCO, 10, 10)
        
        # Atualiza o display (faz as mudanças aparecerem na tela real)
        pygame.display.flip()

    def tela_game_over(self):
        # Tela apresentada entre uma partida e outra
        self.tela.fill(PRETO)
        self.desenhar_texto("GAME OVER", 64, VERMELHO, LARGURA // 2 - 160, ALTURA // 3)
        self.desenhar_texto(f"Sua Pontuação: {self.pontuacao}", 40, BRANCO, LARGURA // 2 - 160, ALTURA // 2)
        self.desenhar_texto("Pressione qualquer tecla para continuar", 24, AMARELO, LARGURA // 2 - 190, ALTURA // 2 + 80)
        pygame.display.flip()
        
        # Trava esperando jogador apertar algo
        self.esperar_tecla()

    def esperar_tecla(self):
        # Dá um pequeno delay para que o jogador não feche a tela sem querer ao continuar atirando (segurando espaço)
        pygame.time.delay(500)
        # Limpa eventos antigos 
        pygame.event.clear()
        esperando = True
        while esperando:
            self.clock.tick(FPS)
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    esperando = False
                    self.rodando = False
                # Captura qualquer tecla pressionada para iniciar uma nova partida
                if event.type == pygame.KEYDOWN:
                    esperando = False

if __name__ == "__main__":
    jogo = Jogo()
    while jogo.rodando:
        jogo.novo_jogo()
        if jogo.rodando:
            jogo.tela_game_over()
            
    pygame.quit()
    sys.exit()
