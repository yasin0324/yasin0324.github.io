// 等待DOM加载完成
document.addEventListener("DOMContentLoaded", function () {
    // 汉堡菜单切换
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");

            // 汉堡菜单动画
            const lines = document.querySelectorAll(".hamburger .line");
            lines[0].classList.toggle("rotate-down");
            lines[1].classList.toggle("hide");
            lines[2].classList.toggle("rotate-up");
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }

            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });

    // 打字机效果
    const typedTextElement = document.getElementById("typed-text");
    if (typedTextElement) {
        const texts = [
            "CODE | DESIGN | INNOVATE",
            "LIFELONG TECH LEARNER",
            "KEEP GOING.",
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typedTextElement.textContent = currentText.substring(
                    0,
                    charIndex - 1
                );
                charIndex--;
                typingSpeed = 50;
            } else {
                typedTextElement.textContent = currentText.substring(
                    0,
                    charIndex + 1
                );
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000; // 停顿时间
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // 切换文本间隔
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }

    // 滚动动画
    const scannerLine = document.querySelector(".scanner-line");
    if (scannerLine) {
        window.addEventListener("scroll", function () {
            let scrolled = window.scrollY;
            scannerLine.style.opacity = 1 - scrolled / 500;
        });
    }

    // 视差效果
    window.addEventListener("mousemove", function (e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const heroContent = document.querySelector(".hero-content");
        if (heroContent) {
            heroContent.style.transform = `translate(${mouseX * 20 - 10}px, ${
                mouseY * 20 - 10
            }px)`;
        }
    });

    // 表单提交处理
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // 表单数据
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            // 这里可以添加表单验证和发送逻辑
            console.log("表单提交:", { name, email, message });

            // 成功提交效果
            const submitButton = document.querySelector(".submit-button");
            submitButton.innerHTML =
                '<span class="button-text">已发送!</span><span class="button-icon"><i class="fas fa-check"></i></span>';
            submitButton.style.borderColor = "var(--neon-green)";
            submitButton.style.color = "var(--neon-green)";

            // 重置表单
            setTimeout(() => {
                contactForm.reset();
                submitButton.innerHTML =
                    '<span class="button-text">发送</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span>';
                submitButton.style.borderColor = "var(--neon-blue)";
                submitButton.style.color = "var(--neon-blue)";
            }, 3000);
        });
    }

    // 故障动画
    const glitchElements = document.querySelectorAll(".glitch");
    glitchElements.forEach((element) => {
        // 确保data-text属性存在
        if (!element.getAttribute("data-text")) {
            element.setAttribute("data-text", element.textContent);
        }

        // 随机故障效果
        setInterval(() => {
            const shouldGlitch = Math.random() > 0.9;
            if (shouldGlitch) {
                element.classList.add("active-glitch");
                setTimeout(() => {
                    element.classList.remove("active-glitch");
                }, 200);
            }
        }, 2000);
    });

    // 添加霓虹灯光晕效果
    const neonElements = document.querySelectorAll(
        ".neon-text, .cyber-heading"
    );
    neonElements.forEach((element) => {
        setInterval(() => {
            const intensity = 0.7 + Math.random() * 0.3;
            element.style.textShadow = `0 0 5px rgba(255, 42, 109, ${intensity}), 0 0 10px rgba(255, 42, 109, ${
                intensity * 0.8
            })`;
        }, 100);
    });

    // 终端效果
    const terminalTexts = document.querySelectorAll(".terminal-text");
    terminalTexts.forEach((text) => {
        const originalText = text.textContent;
        text.textContent = "";

        let i = 0;
        const typeTerminal = () => {
            if (i < originalText.length) {
                text.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeTerminal, 50 + Math.random() * 50);
            }
        };

        setTimeout(typeTerminal, 1000 + Math.random() * 1000);
    });

    // 页面加载动画
    const body = document.querySelector("body");
    body.classList.add("loaded");

    // 添加辉光动画
    const addGlow = () => {
        const glow = document.createElement("div");
        glow.className = "glow";
        document.body.appendChild(glow);

        const size = Math.random() * 100 + 50;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        glow.style.width = `${size}px`;
        glow.style.height = `${size}px`;
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;

        setTimeout(() => {
            glow.remove();
        }, 2000);
    };

    setInterval(addGlow, 3000);
});

// 添加滚动检测，实现元素渐入效果
window.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(
        ".project-card, .profile-card, .terminal-container, .contact-form"
    );

    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add("fade-in");
        }
    });
});

// 添加3D卡片悬停效果
const cards = document.querySelectorAll(".project-card");
cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;

        const rotateX = mouseY / -10;
        const rotateY = mouseX / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateZ(0)`;
    });
});
