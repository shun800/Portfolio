/* ============================================
   Shun Arai Portfolio - 共通JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initSakura();
  initFadeIn();
  initPageTransition();
});

/* --- ヘッダースクロール制御 ---
   スクロール量が50pxを超えたら背景色を付与 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

/* --- ハンバーガーメニュー開閉 --- */
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.sp-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('is-active');
    menu.classList.toggle('is-open');
    // メニュー開閉時にスクロールを制御
    document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
  });

  // ×閉じるボタンをクリックしたら閉じる
  const closeBtn = document.querySelector('.sp-menu-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      btn.classList.remove('is-active');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  // メニュー内リンクをクリックしたら閉じる
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-active');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* --- 桜の花びら落下アニメーション ---
   各ページの .sakura-container に花びらSVGを動的に生成
   花びら4種類: ふっくら型 / 細長型 / 丸型 / 散りかけ型
   花びらサイズ: 16〜36px / 落下速度: 8〜14秒 / opacity: 0.5〜0.75 */
function initSakura() {
  const containers = document.querySelectorAll('.sakura-container');
  if (!containers.length) return;

  // 花びら4種類のSVGテンプレート
  const petalTypes = [
    // ① ふっくら型（sakura2ベース：先端V字・丸みのある標準形）
    `<svg viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 40 C8 32 0 24 0 14 C0 6 4 0 11 0 C13 0 14.5 2 15 4 C15.5 2 17 0 19 0 C26 0 30 6 30 14 C30 24 22 32 15 40Z" fill="#E8A0B0"/>
    </svg>`,
    // ② 丸型（満開の丸いぷっくり花びら）
    `<svg viewBox="0 0 36 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 40 C10 34 0 26 0 15 C0 6 6 0 13 0 C15.5 0 17 2.5 18 5 C19 2.5 20.5 0 23 0 C30 0 36 6 36 15 C36 26 26 34 18 40Z" fill="#E8A0B0"/>
    </svg>`,
    // ③ 散りかけ型（薄く軽い・少しよれた花びら）
    `<svg viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36 C6 28 0 22 1 13 C2 5 6 0 11 1 C13 1.5 13 3 13.5 5 C14.5 3 16 0 18 0 C24 0 27 7 26 15 C25 24 18 30 12 36Z" fill="#E8A0B0" opacity="0.8"/>
    </svg>`
  ];

  containers.forEach(container => {
    // data属性で花びら数を指定可能（デフォルト30枚）
    const count = parseInt(container.dataset.petals) || 30;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('sakura-petal');

      // 4種類からランダムに選択
      const typeIndex = Math.floor(Math.random() * petalTypes.length);
      petal.innerHTML = petalTypes[typeIndex];

      // 花びらのサイズ（16〜36px）
      const size = 16 + Math.random() * 20;
      petal.style.width = size + 'px';
      petal.style.height = size * 1.2 + 'px';

      // ランダムな水平位置
      petal.style.left = Math.random() * 100 + '%';

      // ランダムな落下速度（8〜14秒）
      const duration = 8 + Math.random() * 6;
      petal.style.animationDuration = duration + 's';

      // ランダムな開始遅延（0〜15秒）
      petal.style.animationDelay = Math.random() * 15 + 's';

      // CSS変数でランダム値を設定（横揺れ幅を10〜20pxに）
      const drift = (10 + Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
      const rotate = 180 + Math.random() * 360;
      petal.style.setProperty('--petal-drift', drift + 'px');
      petal.style.setProperty('--petal-rotate', rotate + 'deg');
      petal.style.setProperty('--petal-opacity', (0.5 + Math.random() * 0.25).toFixed(2));

      container.appendChild(petal);
    }
  });
}

/* --- フェードインアニメーション ---
   .fade-in 要素がビューポートに入ったら .is-visible を付与 */
function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(target => observer.observe(target));
}

/* --- お問い合わせフォームバリデーション --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // すべてのエラーを非表示にリセット
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('is-visible'));

    // お名前
    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      showError(name, '※この項目は必須です');
      isValid = false;
    }

    // メールアドレス
    const email = form.querySelector('#email');
    if (!email.value.trim()) {
      showError(email, '※この項目は必須です');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, '※正しいメールアドレスを入力してください');
      isValid = false;
    }

    // 電話番号
    const tel = form.querySelector('#tel');
    if (!tel.value.trim()) {
      showError(tel, '※この項目は必須です');
      isValid = false;
    } else if (!/^[\d\-+()]{10,15}$/.test(tel.value.replace(/\s/g, ''))) {
      showError(tel, '※正しい電話番号を入力してください');
      isValid = false;
    }

    // お問い合わせ種別
    const type = form.querySelector('#type');
    if (!type.value) {
      showError(type, '※この項目は必須です');
      isValid = false;
    }

    // メッセージ
    const message = form.querySelector('#message');
    if (!message.value.trim()) {
      showError(message, '※この項目は必須です');
      isValid = false;
    }

    // バリデーション通過で送信完了ダイアログ表示
    if (isValid) {
      const dialog = document.querySelector('.dialog-overlay');
      if (dialog) dialog.classList.add('is-open');
      form.reset();
    }
  });
}

/* エラーメッセージを表示するヘルパー関数 */
function showError(input, message) {
  const errorEl = input.closest('.form-group').querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }
}

/* --- ダイアログを閉じる --- */
function closeDialog() {
  const dialog = document.querySelector('.dialog-overlay');
  if (dialog) dialog.classList.remove('is-open');
}
/* --- ページ遷移アニメーション ---
   5枚の花びらで🌸の形を作り、くるくる回転して薄ピンクに消える */
function initPageTransition() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  // ページ読み込み時：オーバーレイをフェードアウト
  overlay.classList.add('is-active');
  requestAnimationFrame(() => {
    setTimeout(() => {
      overlay.classList.remove('is-active');
      setTimeout(() => { overlay.innerHTML = ''; }, 300);
    }, 50);
  });

  // すべての内部リンクにイベントを設定
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // 外部リンク・アンカー・javascript:は除外
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto:') || href.startsWith('tel:') ||
        href.startsWith('javascript:') || link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = href;

      // 桜花コンテナを生成
      overlay.innerHTML = '';
      const sakura = document.createElement('div');
      sakura.classList.add('transition-sakura');

      // 5枚の花びらを72°ずつ配置して🌸の形に
      for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.classList.add('transition-sakura-petal');

        // 各花びらの角度（72°ずつ）
        const angle = i * 72;
        // 花びらSVG（sakura2.imgの形：先端V字切れ込み・丸みのある桜花びら）
        petal.innerHTML = `<svg viewBox="0 0 30 40" width="36" height="48" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 40 C8 32 0 24 0 14 C0 6 4 0 11 0 C13 0 14.5 2 15 4 C15.5 2 17 0 19 0 C26 0 30 6 30 14 C30 24 22 32 15 40Z" fill="#E8A0B0" fill-opacity="0.5"/>
        </svg>`;

        // 花びらを中心から外側に配置（72°ずつ回転）
        petal.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;

        sakura.appendChild(petal);
      }

      overlay.appendChild(sakura);

      // ①オーバーレイをフェードイン（薄ピンク背景）
      overlay.classList.add('is-active');

      // ②桜花をくるくる回転開始
      requestAnimationFrame(() => {
        setTimeout(() => {
          sakura.classList.add('is-spinning');
        }, 50);
      });

      // ③ 1.6秒後に実際に遷移
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1600);
    });
  });
}
