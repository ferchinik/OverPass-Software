document.addEventListener('DOMContentLoaded', () => {

    /* ==================== LÓGICA DO MENU DE NAVEGAÇÃO MOBILE ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==================== ANIMAÇÃO DE ELEMENTOS AO ROLAR A PÁGINA ==================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.animated-element');
    animatedElements.forEach(el => observer.observe(el));

    /* ==================== EFEITO DE LUZ AO PASSAR O MOUSE NOS SERVIÇOS ==================== */
    const servicoCards = document.querySelectorAll('.servico-card');

    servicoCards.forEach(card => {
        const lightEffect = card.querySelector('.light-effect') || document.createElement('div');
        if (!lightEffect.classList.contains('light-effect')) {
             lightEffect.classList.add('light-effect');
             card.appendChild(lightEffect);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            lightEffect.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(233, 78, 119, 0.4) 0%, transparent 60%)`;
            lightEffect.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            lightEffect.style.opacity = '0';
        });
    });

    /* ==================== LÓGICA DA ANIMAÇÃO DE PARTÍCULAS ==================== */
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Ajustar o tamanho do canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Posição do mouse
        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 120) * (canvas.width / 120)
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Classe da Partícula
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Interação com o mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 5;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 5;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 5;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 5;
                    }
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Criar as partículas
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - 0.2;
                let directionY = (Math.random() * .4) - 0.2;
                let color = '#9B59B6';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Conectar partículas com linhas
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        let dx = mouse.x - particlesArray[a].x;
                        let dy = mouse.y - particlesArray[a].y;
                        let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                        if (mouseDistance < mouse.radius) {
                             ctx.strokeStyle = `rgba(233, 78, 119, ${opacityValue})`;
                        } else {
                             ctx.strokeStyle = `rgba(155, 89, 182, ${opacityValue})`;
                        }
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Loop de animação
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }
        
        // Responsividade
        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = (canvas.height / 120) * (canvas.width / 120);
            init();
        });

        // Remover o mouse da tela
        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        })

        init();
        animate();
    }
});