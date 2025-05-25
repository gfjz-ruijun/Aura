// loading.js
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('custom-loading-overlay');
    const minimumDisplayTime = 3000; // 确保动画至少显示3秒 (3000毫秒)
    let pageLoadTime = 0;

    // 记录页面开始加载的时间点（近似）
    const startTime = performance.now();

    window.addEventListener('load', () => {
        if (loadingOverlay) {
            // 计算页面实际加载花费的时间
            pageLoadTime = performance.now() - startTime;

            // 计算还需要额外等待的时间，以满足最少3秒的显示要求
            const remainingTime = Math.max(0, minimumDisplayTime - pageLoadTime);

            setTimeout(() => {
                loadingOverlay.classList.add('hidden');

                loadingOverlay.addEventListener('transitionend', () => {
                    if (loadingOverlay.classList.contains('hidden')) {
                        // loadingOverlay.remove(); // 如果需要，取消此行注释
                    }
                }, { once: true });

            }, remainingTime);
        }
    });

    // 可选：如果页面加载时间超过3秒，但 `load` 事件仍未触发（例如某些资源阻塞）
    // 可以设置一个备用计时器，以防万一，但这通常不是必需的，除非有特殊情况
    // setTimeout(() => {
    //     if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
    //         console.warn('Loading fallback: Forcing hide after max timeout.');
    //         loadingOverlay.classList.add('hidden');
    //     }
    // }, minimumDisplayTime + 2000); // 例如，总共等待5秒后强制隐藏
});