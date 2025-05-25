// 确保所有函数定义在最外层或只在一个 DOMContentLoaded 监听器内部

// 1. 滚动渐显效果 - IntersectionObserver (保持不变)
function setupIntersectionObserver() {
    const animatedModules = document.querySelectorAll('.scroll-animated-module');
    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // observerInstance.unobserve(entry.target); // 可选：如果希望动画只触发一次，取消注释此行
                } else {
                    // 如果希望元素离开视口时恢复动画前的状态，可以取消注释下面的行
                    // entry.target.classList.remove('is-visible'); 
                }
            });
        }, { threshold: 0.1 }); // threshold: 0.1 表示元素10%可见时触发
        animatedModules.forEach(module => {
            if (module) observer.observe(module);
        });
    } else {
        // Fallback (保持不变)
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-animated-module');
        const elementInView = (el, percentageScroll = 100) => {
            const elementTop = el.getBoundingClientRect().top;
            return (elementTop <= ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)));
        };
        const displayScrollElement = (element) => element.classList.add('is-visible');
        const handleScrollAnimationFallback = () => {
            scrollRevealElements.forEach((el) => {
                if (elementInView(el, 75)) displayScrollElement(el);
            });
        }
        window.addEventListener('scroll', handleScrollAnimationFallback);
        handleScrollAnimationFallback();
    }
}

// 2. RSS博客拉取 (保持不变)
function fetchRSSFeed() {
    const rssFeedUrl = 'https://gfjzz.cn/rss.xml';
    const corsProxy = 'https://api.allorigins.win/raw?url='; 
    const blogPostsContainer = document.getElementById('blog-posts-container');

    if (blogPostsContainer) {
        fetch(corsProxy + encodeURIComponent(rssFeedUrl))
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                blogPostsContainer.innerHTML = '';
                const items = data.querySelectorAll("item");
                let postsHtml = '';
                items.forEach((el, index) => {
                    if (index < 5) {
                        const title = el.querySelector("title").textContent;
                        const link = el.querySelector("link").textContent;
                        let description = el.querySelector("description")?.textContent || '';
                        if (description.length > 150) description = description.substring(0, 150) + '...';
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = description;
                        description = tempDiv.textContent || tempDiv.innerText || "";
                        postsHtml += `
                            <article class="blog-post-item card-base">
                                <h4><a href="${link}" target="_blank" class="reveal-chars-on-scroll">${title}</a></h4>
                                <p class="post-meta reveal-chars-on-scroll">${ new Date(el.querySelector("pubDate")?.textContent || Date.now()).toLocaleDateString() }</p>
                                <p class="reveal-chars-on-scroll">${description}</p>
                                <a href="${link}" target="_blank" class="cta-button-small">阅读全文</a>
                            </article>
                        `;
                    }
                });
                blogPostsContainer.innerHTML = postsHtml || '<p>暂时无法加载博文...</p>';
                // 博文加载后再初始化这些新内容的逐字动画
                setupGlobalCharReveal(); 
                animateAllVisibleChars();
            })
            .catch(error => {
                console.error('Error fetching RSS:', error);
                blogPostsContainer.innerHTML = '<p>加载博文失败...</p>';
            });
    } else {
        console.warn('Blog posts container not found.');
    }
}

// 3. 动态关键词效果 (保持不变)
function setupDynamicKeywords() {
    // const dynamicKeywords = document.querySelectorAll('.dynamic-keyword');
    // ... 您的实现 ...
}

// 4. 平滑滚动到锚点 (保持不变)
function setupSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 5. 背景音乐控制 (保持不变, 但确保只初始化一次)
function setupBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    if (bgMusic && musicToggleBtn) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                musicToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
                console.warn("背景音乐自动播放被阻止: ", error);
            });
        }
        musicToggleBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => { musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>'; });
            } else {
                bgMusic.pause();
                musicToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    } else {
        console.warn('背景音乐元素未找到。');
    }
}

// 6. 全局文字逐字点亮效果 (统一版本)
function setupGlobalCharReveal() {
    const targets = document.querySelectorAll('.reveal-chars-on-scroll:not([data-chars-prepared])');
    targets.forEach(target => {
        const originalText = target.textContent.trim();
        target.innerHTML = ''; 
        originalText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            target.appendChild(span);
        });
        target.setAttribute('data-chars-prepared', 'true');
    });
}

// 修改逐字动画速度（将30改为50）
function animateAllVisibleChars() {
    const targets = document.querySelectorAll('.reveal-chars-on-scroll[data-chars-prepared]:not([data-chars-animated])');
    targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isInView) {
            const spans = target.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.classList.add('highlighted');
                }, index * 50); // 修改此处
            });
            target.setAttribute('data-chars-animated', 'true'); 
        }
    });
}

// 7. Particles.js 初始化 (保持不变)
function initParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": {"value": 80, "density": {"enable": true, "value_area": 800}},
                "color": {"value": "#ffffff"},
                "shape": {"type": "circle"},
                "opacity": {"value": 0.6, "random": true, "anim": {"enable": true, "speed": 1, "opacity_min": 0.1, "sync": false}},
                "size": {"value": 3, "random": true, "anim": {"enable": true, "speed": 4, "size_min": 0.3, "sync": false}},
                "line_linked": {
                    "enable": true, // 启用连接线
                    "distance": 150, // 连接线的最大距离，可以调整
                    "color": "#000000", // 连接线颜色，已改为黑色
                    "opacity": 0.4, // 连接线透明度，可以调整
                    "width": 1 // 连接线宽度，可以调整
                },
                "move": {"enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false}
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {"onhover": {"enable": true, "mode": "bubble"}, "onclick": {"enable": true, "mode": "repulse"}, "resize": true},
                "modes": {"bubble": {"distance": 200, "size": 4, "duration": 2, "opacity": 0.8}, "repulse": {"distance": 200, "duration": 0.4}}
            },
            "retina_detect": true
        });
    }
}

// 8. 导航栏滚动效果
function setupNavScrollEffect() {
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
}

// 9. 技术栈标签点击交互
function setupSkillTagInteraction() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active'); 
        });
    });
}

// 10. 加载动画处理
function setupLoadingAnimation() {
    const loadingOverlay = document.getElementById('page-loading-overlay'); // 修改ID以匹配index.html中添加的ID
    const contactLinks = document.querySelectorAll('#contact .contact-boxes a');

    if (!loadingOverlay) {
        console.warn('Loading overlay element not found.');
        return;
    }

    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', () => {
        // 可以稍微延迟隐藏，确保页面完全渲染
        setTimeout(() => {
             loadingOverlay.classList.add('hidden'); // 添加一个class来控制隐藏
        }, 500); // 例如延迟0.5秒
    });

    // 联系方式链接点击时显示加载动画并跳转 (如果需要)
    // 注意：这个逻辑与页面加载动画可能冲突，如果只需要页面加载动画，可以移除这部分。
    // 如果需要点击链接时也有加载动画，需要调整逻辑避免重复或冲突。
    // 目前保留，但请注意潜在问题。
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 检查链接是否需要触发加载动画（例如，不是外部链接或特定内部链接）
            // 为了简单起见，这里假设所有联系链接都触发加载动画
            // e.preventDefault(); // 阻止默认跳转，如果需要通过JS控制跳转则取消注释
            // const targetUrl = this.href;

            // 显示加载动画
            loadingOverlay.classList.remove('hidden'); // 移除隐藏class

            // 如果需要JS控制跳转，可以在动画结束后执行
            // setTimeout(() => {
            //     window.location.href = targetUrl;
            // }, 3000); // 动画时长
        });
    });
}

// 主 DOMContentLoaded 监听器
document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    fetchRSSFeed(); // RSS 加载后会自行调用逐字动画的初始化
    setupDynamicKeywords();
    setupSmoothScroll();
    setupBackgroundMusic();
    initParticles();
    setupNavScrollEffect();
    setupSkillTagInteraction();
    setupLoadingAnimation(); // 添加加载动画初始化

    // 初始化页面加载时已可见元素的逐字动画
    setupGlobalCharReveal();
    animateAllVisibleChars();

    // 滚动时触发全局逐字动画
    window.addEventListener('scroll', animateAllVisibleChars);

    // 获取座右铭背景文本元素
    const mottoText = document.querySelector('.motto-background-text');

    if (mottoText) {
        // 监听滚动事件
        window.addEventListener('scroll', () => {
            // 计算滚动偏移量，可以根据需要调整乘数来控制移动速度
            const scrollY = window.scrollY;
            const offset = scrollY * -0.5; // 负值表示向左移动，调整 -0.5 可以改变移动速度

            // 更新CSS变量
            mottoText.style.setProperty('--scroll-offset', `${offset}px`);
        });
    }
});


// Function to set random dissolve positions for spheres
function setSphereRandomPositions() {
    const spheres = document.querySelectorAll('.dissolving-spheres .sphere');
    spheres.forEach(sphere => {
        // Generate random values for x and y translation (e.g., between -50px and 50px)
        const randomX = (Math.random() - 0.5) * 100; // Range from -50 to 50
        const randomY = (Math.random() - 0.5) * 100; // Range from -50 to 50

        // Set CSS variables for the sphere element
        sphere.style.setProperty('--random-x', `${randomX}px`);
        sphere.style.setProperty('--random-y', `${randomY}px`);
    });
}

// Call this function when the page is loaded, before hiding the overlay
window.addEventListener('load', () => {
    // Set random positions for spheres
    setSphereRandomPositions();

    // Hide the loading overlay after a short delay or when other assets are ready
    const loadingOverlay = document.getElementById('page-loading-overlay');
    // Example: Hide after 3 seconds
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 3000); // Adjust delay as needed

    // You might also want to remove the overlay from the DOM after the transition finishes
    loadingOverlay.addEventListener('transitionend', () => {
        if (loadingOverlay.classList.contains('hidden')) {
            loadingOverlay.remove();
        }
    });
});

{{ edit_1 }}

// 公告控制
const announcementOverlay = document.getElementById('announcement-overlay');
const closeAnnouncementBtn = document.querySelector('.announcement-box .close-btn');
// const enterHomepageBtn = document.getElementById('enter-homepage-btn'); // 移除获取新按钮的代码

// 隐藏公告的函数
function hideAnnouncement() {
    console.log('hideAnnouncement called'); // 添加日志输出
    announcementOverlay.classList.add('hidden');
}

// 页面加载完成后处理加载动画和公告显示
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('page-loading-overlay');

    // 监听加载动画的 transitionend 事件来隐藏加载层
    loadingOverlay.addEventListener('transitionend', () => {
        if (loadingOverlay.classList.contains('hidden')) {
            // 可选：移除加载覆盖层以清理DOM
            loadingOverlay.remove();
            // 加载动画隐藏后，显示通知
            showNotification("欢迎来到我的前端宇宙！", "希望您喜欢这里的科技风格设计！");
        }
    }, { once: true }); // 确保事件只触发一次

    // 如果加载动画在页面加载时已经因为某种原因隐藏了，直接显示通知
    const loadingStyle = getComputedStyle(loadingOverlay);
    if (loadingStyle.opacity === '0' || loadingStyle.display === 'none') {
         // 可选：移除加载覆盖层以清理DOM
         loadingOverlay.remove();
         // 直接显示通知
         showNotification("欢迎来到我的前端宇宙！", "希望您喜欢这里的科技风格设计！");
    }

    // 确保加载动画在一定时间后隐藏，即使 transitionend 没有触发 (例如，没有过渡效果)
    // 这里的 setTimeout 应该与加载动画的持续时间匹配或稍长
    // 假设加载动画持续 3 秒 (根据之前的代码)
    setTimeout(() => {
         if (!loadingOverlay.classList.contains('hidden')) {
             loadingOverlay.classList.add('hidden');
         }
    }, 3500); // 稍长于加载动画时间

});

// 为关闭按钮添加事件监听器
closeAnnouncementBtn.addEventListener('click', hideAnnouncement);

// 移除进入主页按钮的事件监听器
// if (enterHomepageBtn) {
//     enterHomepageBtn.removeEventListener('click', hideAnnouncement);
// }

// 音乐播放控制
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = musicToggleBtn.querySelector('i');

let isPlaying = false;

musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    } else {
        bgMusic.play();
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
});

// 尝试在用户交互后自动播放音乐 (解决浏览器限制)
document.addEventListener('click', () => {
    if (!isPlaying && bgMusic.paused) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }).catch(error => {
            console.log('音乐自动播放失败:', error);
        });
    }
}, { once: true }); // 只在第一次点击时尝试自动播放

// 通知控制
const sideNotification = document.getElementById('side-notification');
const notificationTitle = sideNotification.querySelector('h4');
const notificationContent = sideNotification.querySelector('p');

// 显示通知的函数
function showNotification(title, content) {
    notificationTitle.textContent = title;
    notificationContent.textContent = content;
    sideNotification.classList.add('show');
    // 3秒后自动隐藏通知
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

// 隐藏通知的函数
function hideNotification() {
    sideNotification.classList.remove('show');
}


// 获取 body 元素
const body = document.body;

// 添加鼠标移动事件监听器
document.addEventListener('mousemove', (e) => {
    // 获取鼠标相对于视口的坐标
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 获取视口的宽度和高度
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算背景偏移量
    // 这里的 0.02 是一个比例因子，控制背景移动的速度和范围，您可以根据需要调整
    const offsetX = (mouseX / windowWidth - 0.5) * 20; // 例如，最大偏移 20px
    const offsetY = (mouseY / windowHeight - 0.5) * 20; // 例如，最大偏移 20px

    // 应用新的背景位置
    // 注意：这里假设您的网格大小是 20px 20px，如果不是，需要调整计算逻辑
    body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
});

// Dynamic Sketch Background Effect
{{ deletion_start }}
function setupSketchBackground() {
    const body = document.body;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    const ease = 0.1; // Adjust for smoother or faster movement

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Calculate the difference between current position and mouse position
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;

        // Move current position towards mouse position with easing
        currentX += dx * ease;
        currentY += dy * ease;

        // Update CSS variables for background position
        // The background position should move in the opposite direction of the mouse
        body.style.setProperty('--bg-x', `${-currentX * 0.05}px`); // Adjust multiplier for speed
        body.style.setProperty('--bg-y', `${-currentY * 0.05}px`); // Adjust multiplier for speed

        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
}

// Call the setup function when the DOM is fully loaded
// Make sure the body has the class 'sketch-background'
// document.addEventListener('DOMContentLoaded', setupSketchBackground);
// Note: This is now called within the main DOMContentLoaded listener
{{ deletion_end }}

// Page Loading Animation
{{ deletion_start }}
function setupLoadingAnimation() {
    const loadingOverlay = document.getElementById('page-loading-overlay');
    const spheresContainer = document.querySelector('.dissolving-spheres');
    const spheres = spheresContainer ? spheresContainer.querySelectorAll('.sphere') : [];

    // Function to set random positions for spheres
    function setSphereRandomPositions() {
        if (!spheresContainer) return;
        const containerRect = spheresContainer.getBoundingClientRect();
        const containerCenterX = containerRect.width / 2;
        const containerCenterY = containerRect.height / 2;

        spheres.forEach(sphere => {
            // Generate random angle and distance from center
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 100 + 50; // Random distance from 50 to 150px

            // Calculate target position relative to the center
            const targetX = containerCenterX + distance * Math.cos(angle);
            const targetY = containerCenterY + distance * Math.sin(angle);

            // Set CSS variables for the animation to use
            sphere.style.setProperty('--random-x', `${targetX - containerCenterX}px`);
            sphere.style.setProperty('--random-y', `${targetY - containerCenterY}px`);
        });
    }

    // Set initial random positions
    setSphereRandomPositions();

    // Re-set random positions periodically or on resize if needed
    // setInterval(setSphereRandomPositions, 3000); // Example: change positions every 3 seconds

    // Hide loading overlay after page load
    window.addEventListener('load', () => {
        // Add a small delay to ensure animations play
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                // Remove the overlay after the transition ends
                loadingOverlay.addEventListener('transitionend', () => {
                    loadingOverlay.style.display = 'none';
                }, { once: true });

                // Fallback in case transitionend doesn't fire
                setTimeout(() => {
                    if (loadingOverlay.style.display !== 'none') {
                        loadingOverlay.style.display = 'none';
                    }
                }, 3500); // Should be longer than the CSS transition duration
            }
        }, 500); // Delay before starting fade out
    });
}
{{ deletion_end }}

document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    fetchRSSFeed(); // RSS 加载后会自行调用逐字动画的初始化
    setupDynamicKeywords();
    setupSmoothScroll();
    setupBackgroundMusic();
    initParticles();
    setupNavScrollEffect();
    setupSkillTagInteraction();
    // Call the setup function for the sketch background
    // Make sure the body has the class 'sketch-background'
    {{ deletion_start }}
    if (document.body.classList.contains('sketch-background')) {
        setupSketchBackground();
    }
    {{ deletion_end }}

    // Add loading animation initialization
    {{ deletion_start }}
    setupLoadingAnimation();
    {{ deletion_end }}

    setupGlobalCharReveal();
    animateAllVisibleChars();
});

// 加载说说内容的函数
async function loadShuoShuo() {
    const container = document.getElementById('shuo-shuo-container');
    if (!container) return;

    // 清空加载提示
    container.innerHTML = '';

    try {
        const response = await fetch('shuoshuo.json'); // 从JSON文件获取数据
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const shuoShuoData = await response.json();

        if (shuoShuoData.length === 0) {
            container.innerHTML = '<p>暂无说说内容。</p>';
            return;
        }

        shuoShuoData.forEach(item => {
            const shuoShuoElement = document.createElement('div');
            shuoShuoElement.classList.add('shuo-shuo-item');
            shuoShuoElement.innerHTML = `
                ${item.text}
                <span class="timestamp">${item.timestamp}</span>
            `;
            container.appendChild(shuoShuoElement);
        });
    } catch (error) {
        console.error('加载说说失败:', error);
        container.innerHTML = '<p>加载说说失败，请稍后再试。</p>';
    }
}

// 在页面加载完成后调用加载说说的函数
document.addEventListener('DOMContentLoaded', () => {
    // loadShuoShuo(); // 移除这行代码
});

// 10. 从 GitHub 加载作品集
async function loadGitHubPortfolio() {
    const username = 'gfjz-ruijun'; // 您的 GitHub 用户名
    const portfolioContainer = document.getElementById('portfolio-container');

    if (!portfolioContainer) {
        console.warn('Portfolio container not found.');
        return;
    }

    portfolioContainer.innerHTML = '<p class="loading-text">正在加载作品集...</p>'; // 添加加载提示

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) {
            throw new Error(`GitHub API 请求失败: ${response.status}`);
        }
        const repos = await response.json();

        portfolioContainer.innerHTML = ''; // 清空加载提示

        if (repos.length === 0) {
            portfolioContainer.innerHTML = '<p>暂无公开的仓库。</p>';
            return;
        }

        repos.forEach(repo => {
            // 您可以选择只显示一部分仓库，或者根据需要过滤
            // 例如，只显示有描述的仓库，或者排除 fork 的仓库
            // if (repo.fork || !repo.description) return;

            const repoElement = document.createElement('article');
            repoElement.classList.add('portfolio-item', 'card-base', 'scroll-animated-module'); // 添加卡片和动画类

            let description = repo.description || '暂无描述';
            if (description.length > 100) {
                description = description.substring(0, 97) + '...';
            }

            repoElement.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" class="reveal-chars-on-scroll">${repo.name}</a></h3>
                <p class="repo-description reveal-chars-on-scroll">${description}</p>
                <div class="repo-meta reveal-chars-on-scroll">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    ${repo.language ? `<span>💻 ${repo.language}</span>` : ''}
                </div>
                <a href="${repo.html_url}" target="_blank" class="cta-button-small">查看项目</a>
            `;
            portfolioContainer.appendChild(repoElement);
        });
        
        // 作品集加载后再初始化这些新内容的逐字动画
        setupGlobalCharReveal(); 
        animateAllVisibleChars();
        // 重新设置滚动渐显，因为我们动态添加了元素
        setupIntersectionObserver(); 

    } catch (error) {
        console.error('加载 GitHub 作品集失败:', error);
        portfolioContainer.innerHTML = '<p class="error-text">加载作品集失败，请稍后再试。</p>';
    }
}

// 在 DOMContentLoaded 事件中调用修改后的函数
// 请找到您现有的 DOMContentLoaded 监听器，并在其中添加 loadGitHubPortfolio();
document.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    fetchRSSFeed();
    setupSmoothScroll();
    setupBackgroundMusic();
    setupGlobalCharReveal();
    animateAllVisibleChars(); 
    initParticles();
    setupNavScrollEffect();
    // animateAboutBackgroundOnScroll(); // 如果您保留了之前的背景滚动功能

    loadLocalPortfolio(); // <--- 确保调用的是新函数名
});
