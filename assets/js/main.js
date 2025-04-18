  // ======================================
  // 页面初始化操作
  // ======================================
  window.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    const scrollContainer = document.querySelector('.nu-scrollbar');
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    }
  
    const parents = document.querySelectorAll('.animate-text');
    parents.forEach(parent => {
      if (parent.children.length > 0) {
        parent.style.width = `${parent.children[0].clientWidth}px`;
      }
    });
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });

  // ======================================
  // 凉兮语录
  // ======================================
  function getRandomQuotes(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const selected = getRandomQuotes(quotes, 3);

  // 把内容插入到 DOM（注意要配合你 HTML 结构里的目标容器）
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".quote-featured").innerHTML = selected[0];
    document.querySelectorAll(".scroll-track")[0].innerHTML = `<span>${selected[1]}</span><span>${selected[1]}</span>`;
    document.querySelectorAll(".scroll-track")[1].innerHTML = `<span>${selected[2]}</span><span>${selected[2]}</span>`;
  });


// ======================================
// BANNER 动画：文本模糊渐变切换效果
// ======================================

const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2")
  };
  const texts = bannerTexts;
  const morphTime = 3.2;
  const cooldownTime = 1.8;
  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;
  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
  
  function doMorph() {
    morph -= cooldown;
    cooldown = 0;
  
    let fraction = morph / morphTime;
    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }
  
    setMorph(fraction);
  }
  
  function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
  }
  
  function doCooldown() {
    morph = 0;
    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";
    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
  }
  
  function animate() {
    requestAnimationFrame(animate);
  
    let newTime = new Date();
    const dt = (newTime - time) / 1000;
    time = newTime;
  
    cooldown -= dt;
  
    if (cooldown <= 0) {
      if (cooldown + dt > 0) {
        textIndex++;
      }
      doMorph();
    } else {
      doCooldown();
    }
  }
  animate();

// ======================================
// 推特板块
// ======================================
  window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    js.async = true;
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  }(document, "script", "twitter-wjs"));
  const TWITTER_LOAD_TIMEOUT = 15000;
  let twitterLoadTimer;

  function handleTwitterLoad() {
    const twitterSkeleton = document.getElementById("twitter-skeleton");
    const twitterFeed = document.getElementById("twitter-feed");
    twitterSkeleton.style.display = "none";
    setTimeout(() => {
      twitterFeed.classList.remove("opacity-0");
      twitterFeed.classList.add("opacity-100");
    }, 100);
    clearTimeout(twitterLoadTimer);
  }

  function handleTwitterError() {
    const twitterSkeleton = document.getElementById("twitter-skeleton");
    const twitterFeed = document.getElementById("twitter-feed");
    const twitterContainer = document.querySelector(".secBnr__timeline");
    twitterSkeleton.style.display = "none";
    const errorMessage = document.createElement("div");
    errorMessage.className = "bg-white/80 rounded-xl p-4 text-center text-gray-600";
    errorMessage.innerHTML = `
      <p class="mb-2">无法加载Twitter时间线</p>
      <a href="https://twitter.com/liangxihuigui" target="_blank" 
        class="text-blue-500 hover:underline">点击访问凉兮的Twitter主页</a>
    `;
    twitterContainer.appendChild(errorMessage);
    twitterFeed.style.display = "none";
  }

  twitterLoadTimer = setTimeout(() => {
    if (document.getElementById("twitter-skeleton").style.display !== "none") {
      console.warn("Twitter加载超时，启用备用方案");
      handleTwitterError();
    }
  }, TWITTER_LOAD_TIMEOUT);

  twttr.ready(function(twttr) {
    twttr.events.bind('rendered', function(event) {
      console.log("[🐦Twitter加载监听] 推文加载完成 ✅");
      handleTwitterLoad();
    });
    
    twttr.events.bind('error', function(error) {
      console.error("[🐦Twitter加载监听] 加载失败", error);
      handleTwitterError();
    });
    
    clearTimeout(twitterLoadTimer);
  });

// ======================================
// KOL板块
// ======================================
const list = document.querySelector('ul');
const items = list.querySelectorAll('li');
const setIndex = event => {
  const closest = event.target.closest('li');
  if (closest) {
    const index = [...items].indexOf(closest);

    const rows = new Array(items.length)
      .fill()
      .map((_, i) => {
        items[i].dataset.active = (index === i).toString();
        return index === i ? '10fr' : '2fr';
      })
      .join(' ');

    list.style.setProperty('grid-template-rows', rows);
  }
};

items.forEach(item => {
  item.addEventListener('click', setIndex);
});

list.addEventListener('focus', setIndex, true);
list.addEventListener('click', setIndex);
list.addEventListener('pointermove', setIndex);
const resync = () => {
  const w = Math.max(
  ...[...items].map(i => {
    return i.offsetWidth;
  }));

  list.style.setProperty('--article-width', w);
};
window.addEventListener('resize', resync);
resync();

// ======================================
// 币价板块
// ======================================
const container = document.getElementById("crypto-prices");
let lastSuccessfulData = []; // 缓存上一轮成功获取的数据

async function fetchTopCoins() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=23&page=1&sparkline=false");
    const data = await res.json();
    const filtered = data
      .filter(coin => !['tether', 'usd-coin', 'usds'].includes(coin.id))
      .sort((a, b) => b.market_cap - a.market_cap)
      .slice(0, 23);

    lastSuccessfulData = filtered; // 缓存这次成功的数据
    renderCoins(filtered);

  } catch (err) {
    console.error("加载币价失败：", err);
    if (lastSuccessfulData.length > 0) {
      renderCoins(lastSuccessfulData); // 使用上一次的缓存数据
    } else {
      container.innerHTML = `<p class="text-gray-500 text-center col-span-5 py-4 text-sm">数据加载中...</p>`;
    }
  }
}

function renderCoins(data) {
  container.innerHTML = "";

  data.forEach(coin => {
    const isUp = coin.price_change_percentage_24h >= 0;
    const priceChangeClass = isUp ? 'text-green-500' : 'text-red-500';
    const arrowIcon = isUp ? '↑' : '↓';
    const price = coin.current_price < 1 ? 
      coin.current_price.toPrecision(3) : 
      coin.current_price.toLocaleString(undefined, {maximumFractionDigits: coin.current_price > 1000 ? 0 : 2});

    const html = `
      <div class="bg-white/90 hover:bg-white p-3 rounded-lg shadow-sm hover:shadow transition-all duration-200 border border-gray-100 flex flex-col">
        <div class="flex justify-between items-center mb-1">
          <div class="flex items-center gap-2 min-w-0">
            <img src="${coin.image}" alt="${coin.name}" class="w-5 h-5 shrink-0" loading="lazy">
            <span class="font-medium text-gray-800 text-sm truncate">${coin.symbol.toUpperCase()}</span>
          </div>
          <span class="text-xs ${priceChangeClass} font-medium whitespace-nowrap">
            ${arrowIcon}${Math.abs(coin.price_change_percentage_24h).toFixed(1)}%
          </span>
        </div>
        <div class="text-lg font-bold text-gray-900 truncate" title="$${coin.current_price}">
          $${price}
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-[10px] text-gray-500 whitespace-nowrap">
            ${(coin.market_cap / 1000000000).toFixed(2)}B
          </span>
          <span class="text-[10px] text-gray-500 whitespace-nowrap">
            ${(coin.total_volume / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });
}

fetchTopCoins();
setInterval(fetchTopCoins, 30000);
