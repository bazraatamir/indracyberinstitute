(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return (root || document).querySelectorAll(sel);
  }

  function escapeHtml(str) {
    if (str == null) return "";
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function contentUrl() {
    const base = (document.body.dataset.contentBase || ".").replace(/\/$/, "");
    return `${base}/data/content.json`;
  }

  function renderSharedNav(data, pageKey) {
    const sh = data.shared;
    const fromRoot = pageKey === "index";
    const items = fromRoot ? sh.navFromRoot : sh.navFromPages;
    const activeMap = {index: 0, programs: 1, team: 2};
    const activeIdx =
      activeMap[document.body.dataset.navActive || pageKey] ?? 0;

    qsa(".nav-links li").forEach((li, i) => {
      const a = li.querySelector("a");
      if (!a || !items[i]) return;
      a.href = items[i].href;
      a.textContent = items[i].label;
      a.classList.toggle("act", i === activeIdx);
    });

    const cta = qs(".nav-cta");
    if (cta) {
      cta.href = fromRoot ? sh.cta.hrefFromRoot : sh.cta.hrefFromPages;
      cta.textContent = sh.cta.label;
    }

    const search = qs(".nav-search");
    if (search) {
      Array.from(search.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) n.remove();
      });
      search.append(document.createTextNode(sh.searchPlaceholder));
    }

    const logo = qs(".nav-logo");
    if (logo) {
      logo.setAttribute("aria-label", sh.brand.logoAria);
      const img = qs(".logo-shield img");
      if (img) {
        img.src = (fromRoot ? "./" : "../") + sh.brand.logoSrc;
      }
      const main = qs(".logo-main");
      const sub = qs(".logo-sub");
      if (main) main.textContent = sh.brand.name;
      if (sub) sub.textContent = sh.brand.since;
    }
  }

  function renderSubpage(data, pageKey) {
    const pg = data[pageKey + "Page"];
    if (pg?.metaTitle) document.title = pg.metaTitle;
    renderSharedNav(data, pageKey);

    const nm = qs(".ft-nm");
    if (nm) {
      const b = data.shared.brand;
      nm.textContent = `${b.name} · ${b.since}`;
    }
    const fc = qs("footer .ft-copy");
    if (fc) {
      const c = data.shared.footerCopy;
      fc.innerHTML = `${c.prefix}<span class="ft-gold">${escapeHtml(c.brandGold)}</span>${escapeHtml(c.suffix)}`;
    }
  }

  function renderIndex(data) {
    const sh = data.shared;
    const ix = data.index;
    if (!ix) return;

    if (ix.meta?.title) document.title = ix.meta.title;
    renderSharedNav(data, "index");

    const tp = qs(".badge-svg textPath");
    if (tp && ix.hero.badgeRing) tp.textContent = ix.hero.badgeRing;

    const bc = qs(".badge-ctr");
    if (bc) {
      bc.innerHTML = `${escapeHtml(ix.hero.badgeLine1)}<br />${escapeHtml(ix.hero.badgeLine2)}`;
    }

    const h1 = qs(".hl1");
    const h2 = qs(".hl2");
    const h3 = qs(".hl3");
    if (h1) h1.textContent = ix.hero.hl1;
    if (h2) h2.textContent = ix.hero.hl2;
    if (h3) h3.textContent = ix.hero.hl3;

    const desc = qs(".hero-desc");
    if (desc) desc.textContent = ix.hero.desc;

    const btnFill = qs(".btn-fill");
    if (btnFill) {
      btnFill.innerHTML = `${escapeHtml(ix.hero.btnPrimary)} <span class="pill-arrow">→</span>`;
    }
    const btnStroke = qs(".btn-stroke");
    if (btnStroke) btnStroke.textContent = ix.hero.btnSecondary;

    qsa(".hero-stats .hstat").forEach((statEl, i) => {
      const s = ix.hero.stats[i];
      if (!s) return;
      const nEl = statEl.querySelector(".hstat-n");
      const lEl = statEl.querySelector(".hstat-l");
      if (nEl) {
        if (s.numSuffix) {
          nEl.innerHTML = `${escapeHtml(s.num)}<sup>${escapeHtml(s.numSuffix)}</sup>`;
        } else {
          nEl.textContent = s.num;
        }
      }
      if (lEl) lEl.textContent = s.label;
    });

    const phIcon = qs(".ph-icon");
    if (phIcon) phIcon.textContent = ix.hero.placeholderIcon;
    const phLabel = qs(".ph-label");
    if (phLabel) phLabel.textContent = sh.brand.name;
    const imgChip = qs(".img-chip");
    if (imgChip) imgChip.textContent = ix.hero.imgChip;
    const imgBadgeTop = qs(".img-badge-top");
    if (imgBadgeTop) imgBadgeTop.textContent = ix.hero.imgBadgeTop;
    const imgBadgeBot = qs(".img-badge-bot");
    if (imgBadgeBot) imgBadgeBot.textContent = ix.hero.imgBadgeBot;

    const progs = ix.programs;
    const progsSec = qs("#programs");
    if (progsSec && progs) {
      const eyebrow = progsSec.querySelector(".eyebrow");
      const title = progsSec.querySelector(".progs-hd .sec-title");
      const sub = progsSec.querySelector(".sec-sub");
      if (eyebrow) eyebrow.textContent = progs.eyebrow;
      if (title) title.innerHTML = progs.titleHtml;
      if (sub) sub.textContent = progs.sub;

      progs.cards.forEach((card) => {
        const el = qs(`.pc.${card.class}`);
        if (!el) return;
        const vis = el.querySelector(".pc-vis");
        if (vis) {
          vis.textContent = "";
          const emojiVal = (card.emoji ?? "").toString();
          const isImg = /\.(png|jpe?g|webp|gif|svg)$/i.test(emojiVal.trim());
          if (isImg) {
            const img = document.createElement("img");
            img.src = emojiVal;
            img.alt = card.tag || card.class || "Program icon";
            img.width = 250;
            img.height = 250;
            img.decoding = "async";
            vis.append(img);
          } else {
            vis.append(document.createTextNode(emojiVal));
          }
          const vnum = document.createElement("div");
          vnum.className = "pc-vnum";
          vnum.textContent = card.num;
          vis.append(vnum);
        }
        const tag = el.querySelector(".pc-tag");
        if (tag) tag.textContent = card.tag;
        const name = el.querySelector(".pc-name");
        if (name) name.innerHTML = card.titleHtml;
        const pdesc = el.querySelector(".pc-desc");
        if (pdesc) pdesc.textContent = card.desc;
        const pillsWrap = el.querySelector(".pc-pills");
        if (pillsWrap) {
          pillsWrap.innerHTML = card.pills
            .map((p) => `<span class="pc-pill">${escapeHtml(p)}</span>`)
            .join("");
        }
        const dur = el.querySelector(".pc-dur");
        const durS = el.querySelector(".pc-dur-s");
        if (dur) dur.textContent = card.dur;
        if (durS) durS.textContent = card.durSub;
      });
    }

    const ab = ix.about;
    const aboutSec = qs("#about");
    if (aboutSec && ab) {
      aboutSec.querySelector(".eyebrow").textContent = ab.eyebrow;
      aboutSec.querySelector(".sec-title").innerHTML = ab.titleHtml;
      const emoji = qs(".about-box-emoji");
      if (emoji) emoji.textContent = ab.emoji;
      const float = qs(".about-float");
      if (float) {
        float.innerHTML = `${escapeHtml(ab.floatNum)}<span>${escapeHtml(ab.floatSub)}</span>`;
      }
      qsa("#about .about-p").forEach((p, i) => {
        if (ab.paragraphs[i]) p.textContent = ab.paragraphs[i];
      });
      qsa("#about .about-li").forEach((li, i) => {
        if (!ab.bullets[i]) return;
        const dot = li.querySelector(".about-dot");
        li.textContent = "";
        if (dot) li.appendChild(dot);
        li.append(document.createTextNode(ab.bullets[i]));
      });
    }

    const why = ix.why;
    const whySec = qs("#why");
    if (whySec && why) {
      whySec.querySelector(".eyebrow").textContent = why.eyebrow;
      whySec.querySelector(".sec-title").innerHTML = why.titleHtml;
      qsa("#why .why-row").forEach((row, i) => {
        const r = why.rows[i];
        if (!r) return;
        const n = row.querySelector(".why-n");
        const h = row.querySelector(".why-h");
        const p = row.querySelector(".why-p");
        if (n) n.textContent = r.n;
        if (h) h.textContent = r.h;
        if (p) p.textContent = r.p;
      });
      why.tracks.forEach((t) => {
        const row = qs(`.track-row.${t.class}`);
        if (!row) return;
        const icon = row.querySelector(".track-icon");
        const nm = row.querySelector(".track-nm");
        const sk = row.querySelector(".track-sk");
        const dur = row.querySelector(".track-dur");
        if (icon) {
          icon.textContent = "";
          const iconVal = (t.icon ?? "").toString();
          const isImg = /\.(png|jpe?g|webp|gif|svg)$/i.test(iconVal.trim());
          if (isImg) {
            const img = document.createElement("img");
            img.src = iconVal;
            img.alt = t.name || t.class || "Track icon";
            img.width = 46;
            img.height = 46;
            img.decoding = "async";
            icon.append(img);
          } else {
            icon.append(document.createTextNode(iconVal));
          }
        }
        if (nm) nm.textContent = t.name;
        if (sk) sk.textContent = t.skills;
        if (dur) dur.textContent = t.dur;
      });
      const te = why.testimonial;
      const tt = qs(".testi-t");
      const ta = qs(".testi-av");
      const tn = qs(".testi-name");
      const tr = qs(".testi-role");
      if (tt) tt.textContent = te.text;
      if (ta) ta.textContent = te.avatar;
      if (tn) tn.textContent = te.name;
      if (tr) tr.textContent = te.role;
    }

    const tm = ix.team;
    const teamSec = qs("#team");
    if (teamSec && tm) {
      teamSec.querySelector(".eyebrow").textContent = tm.eyebrow;
      teamSec.querySelector(".sec-title").innerHTML = tm.titleHtml;
      qsa("#team .tc").forEach((card, i) => {
        const m = tm.members[i];
        if (!m) return;
        const av = card.querySelector(".tc-av");
        av.textContent = m.initials;
        av.className = "tc-av" + (m.avClass ? " " + m.avClass : "");
        card.querySelector(".tc-name").textContent = m.name;
        card.querySelector(".tc-role").textContent = m.role;
        const pills = card.querySelector(".tc-pills");
        pills.innerHTML = m.pills
          .map((p) => `<span class="tc-pill">${escapeHtml(p)}</span>`)
          .join("");
      });
    }

    const cf = ix.contact;
    if (cf) {
      const setLabel = (id, text) => {
        const lb = qs(`label[for="${id}"]`);
        if (lb) lb.textContent = text;
      };
      const setPh = (id, text) => {
        const el = qs("#" + id);
        if (el) el.placeholder = text;
      };
      setLabel("c-name", cf.labels.name);
      setPh("c-name", cf.placeholders.name);
      setLabel("c-email", cf.labels.email);
      setPh("c-email", cf.placeholders.email);
      setLabel("c-phone", cf.labels.phone);
      setPh("c-phone", cf.placeholders.phone);
      setLabel("c-course", cf.labels.course);
      setPh("c-course", cf.placeholders.course);
      setLabel("c-msg", cf.labels.message);
      setPh("c-msg", cf.placeholders.message);
      const subBtn = qs(".fs-btn");
      if (subBtn) subBtn.textContent = cf.submit;

      const ciBig = qs(".ci-big");
      const ciSub = qs(".ci-sub");
      if (ciBig) ciBig.textContent = cf.sideTitle;
      if (ciSub) ciSub.textContent = cf.sideSub;

      const rows = qsa(".ci-row");
      if (rows[0]) {
        rows[0].querySelector(".ci-lb").textContent = cf.addressLabel;
        rows[0].querySelector(".ci-vl").textContent = cf.address;
      }
      if (rows[1]) {
        rows[1].querySelector(".ci-lb").textContent = cf.phoneLabel;
        rows[1].querySelector(".ci-vl").textContent = cf.phone;
      }
      if (rows[2]) {
        rows[2].querySelector(".ci-lb").textContent = cf.emailLabel;
        const vl = rows[2].querySelector(".ci-vl");
        vl.innerHTML = `<a href="mailto:${escapeHtml(cf.email)}">${escapeHtml(cf.email)}</a>`;
      }
      if (rows[3]) {
        rows[3].querySelector(".ci-lb").textContent = cf.socialLabel;
        const socialWrap = rows[3].querySelector(".ci-social");
        if (socialWrap) {
          socialWrap.innerHTML = cf.social
            .map(
              (s, i) =>
                `${i ? '<span class="ci-dot">·</span>' : ""}<a href="${escapeHtml(s.href)}" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`,
            )
            .join("");
        }
      }
    }

    const ft = ix.footer;
    if (ft) {
      qs(".ft-mark").textContent = sh.footerBrand.mark;
      const brandNameEl = qs(".ft-brand-nm span:not(.ft-mark)");
      if (brandNameEl) brandNameEl.textContent = sh.footerBrand.name;
      qs(".ft-p").textContent = sh.footerBrand.tagline;

      const colTitles = qsa(".ft-top .ft-col-t");
      const linkUls = qsa(".ft-top .ft-links");
      if (colTitles[0]) colTitles[0].textContent = ft.colCourses;
      if (linkUls[0]) {
        linkUls[0].innerHTML = ft.courseLinks
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
          )
          .join("");
      }
      if (colTitles[1]) colTitles[1].textContent = ft.colCompany;
      if (linkUls[1]) {
        linkUls[1].innerHTML = ft.companyLinks
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
          )
          .join("");
      }
      if (colTitles[2]) colTitles[2].textContent = ft.colContact;
      if (linkUls[2]) {
        linkUls[2].innerHTML = ft.contactLinks
          .map((l) => {
            const rel = l.rel ? ` rel="${escapeHtml(l.rel)}"` : "";
            return `<li><a href="${escapeHtml(l.href)}"${rel}>${escapeHtml(l.label)}</a></li>`;
          })
          .join("");
      }

      const c = sh.footerCopy;
      const ftCopy = qs(".ft-bottom .ft-copy");
      if (ftCopy) {
        ftCopy.innerHTML = `${escapeHtml(c.prefix)}<span class="ft-gold">${escapeHtml(c.brandGold)}</span>${escapeHtml(c.suffix)}`;
      }
      const legal = qs(".ft-legal");
      if (legal && sh.legal) {
        legal.innerHTML = `<a href="#">${escapeHtml(sh.legal.privacy)}</a><span class="ft-legal-sep"> · </span><a href="#">${escapeHtml(sh.legal.terms)}</a>`;
      }
    }
  }

  function run() {
    const page = document.body.dataset.page || "index";
    fetch(contentUrl())
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((data) => {
        if (page === "index") renderIndex(data);
        else if (page === "programs") renderSubpage(data, "programs");
        else if (page === "team") renderSubpage(data, "team");
      })
      .catch((err) => {
        console.warn("[ICI] content.json ачаалахад алдаа:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
